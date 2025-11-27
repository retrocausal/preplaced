// Import Mongoose with types
import mongoose, { Schema, Types } from 'mongoose';
import { ChatDocument, MessageDocument } from '#definitions/models';
import { CustomException } from '#utils/exception';

const { ObjectId } = Schema.Types;
// Define schema
const schema = new mongoose.Schema(
  {
    participants: [
      {
        type: ObjectId,
        required: true,
        ref: 'User',
        default: [],
        validate: {
          validator: async (userId: mongoose.Types.ObjectId) => {
            return !!(await mongoose.model('User').findById(userId));
          },
          message: (props: { value: Types.ObjectId }) =>
            `User with ID ${props.value} does not exist`,
        },
      },
    ], // Reference to User model
    previousParticipants: [
      {
        type: ObjectId,
        required: false,
        ref: 'User',
        default: [],
      },
    ], // Reference to User model
    messages: [{ type: ObjectId, ref: 'Message' }],
    messageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    participantCount: { type: Number, default: 0 }, // Optional field for participant count
  },
  {
    validateBeforeSave: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete (ret as Partial<typeof ret>).previousParticipants; // Remove previousParticipants from JSON output
        delete (ret as Partial<typeof ret>).participants; // Remove participants from JSON output
        delete (ret as Partial<typeof ret>).messages; // Remove messages from JSON output
        delete (ret as Partial<typeof ret>).__v; // Remove version key from JSON output
        delete (ret as Partial<typeof ret>).createdAt;
        return ret;
      },
    },
  },
);

// Add indexes
schema.index({ participants: 1 }); // Index for participant lookups
schema.index({ messages: 1 }); // Index for message ID lookups

schema.virtual('members').get(function (this: ChatDocument) {
  if (this.populated('participants') && this.participants && Array.isArray(this.participants)) {
    return this.participants.map((p) => {
      if (typeof p === 'object' && 'username' in p) {
        return p.username; // Return only username
      }
      return p; // Fallback for non-object participants
    });
  }
});
schema.virtual('conversations').get(function (this: ChatDocument) {
  if (this.populated('messages') && this.messages && Array.isArray(this.messages)) {
    return (this.messages as MessageDocument[]).sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }
});

schema.pre('save', async function (this: ChatDocument, next) {
  try {
    const Models = {
      Chat: mongoose.model('Chat'),
      User: mongoose.model('User'),
    };
    if (this.isModified('participants')) {
      if (!this.isNew) {
        const previousParticipants =
          this.previousParticipants.length < 1
            ? (await Models.Chat.findById(this._id, 'participants'))?.participants || []
            : [...(this.previousParticipants as Types.ObjectId[])];

        const existingParticipants = this.participants;
        const newParticipants = (existingParticipants as Types.ObjectId[]).filter(
          (p) => !(previousParticipants as Types.ObjectId[]).includes(p),
        );
        const removedParticipants = (previousParticipants as Types.ObjectId[]).filter(
          (p) => !(existingParticipants as Types.ObjectId[]).includes(p),
        );
        // Set previousParticipants before async operations
        this.previousParticipants = this.participants.slice() as Types.ObjectId[];

        const promises: Promise<any>[] = [];
        newParticipants.forEach((userId) => {
          promises.push(
            Models.User.findByIdAndUpdate(userId, {
              $inc: { chatCount: 1 },
            }),
          );
        });
        removedParticipants.forEach((userId) => {
          promises.push(
            Models.User.findByIdAndUpdate(userId, {
              $inc: { chatCount: -1 },
            }),
          );
        });
        await Promise.all(promises);
      } else {
        // If it's a new chat, increment chatCount for all participants
        const promises: Promise<any>[] = [];
        this.participants.forEach((userId) => {
          promises.push(
            Models.User.findByIdAndUpdate(userId, {
              $inc: { chatCount: 1 },
            }),
          );
        });
        await Promise.all(promises);
        // Set previousParticipants for new chat
        this.previousParticipants = this.participants.slice() as Types.ObjectId[];
      }

      if (
        this.isNew ||
        this.isModified('messages') ||
        (this.messages.length && this.messageCount !== this.messages.length)
      ) {
        this.messageCount = this.messages.length;
      }
      if (
        this.isNew ||
        this.isModified('participants') ||
        (this.participants.length && this.participantCount !== this.participants.length)
      ) {
        this.participantCount = this.participants.length;
      }
    }
    if (this.isNew && this.participants.length < 2) {
      return next(new CustomException('Chat must have at least 2 participants at creation', 400));
    }
    next();
  } catch (error) {
    next(error as unknown as mongoose.Error | Error); // Propagate error to Express
  }
});
// Export Chat model with interface
export default mongoose.model<ChatDocument>('Chat', schema);
