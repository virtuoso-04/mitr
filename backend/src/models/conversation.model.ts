import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  sender: 'user' | 'ai';
  persona?: 'arjuna' | 'maya';
  isCrisisResponse?: boolean;
  createdAt: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Message schema
const messageSchema = new Schema<IMessage>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    persona: {
      type: String,
      enum: ['arjuna', 'maya'],
    },
    isCrisisResponse: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Conversation schema
const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema],
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to improve query performance
conversationSchema.index({ userId: 1, lastActive: -1 });

// Create and export Conversation model
const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
export default Conversation;
