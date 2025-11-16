import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ChatMessage = {
  id: string
  message: string
  createdAt: Date
  senderid: string | null
  recieverId: string | null
}

type InitialStateProps = {
  chat: Record<string, ChatMessage[]>
}

const InitialState: InitialStateProps = {
  chat: {},
}

export const onChats = createSlice({
  name: "chats",
  initialState: InitialState,
  reducers: {
    onChat: (
      state,
      action: PayloadAction<{ chat: ChatMessage[]; activeChatId: string }>,
    ) => {
      const { chat, activeChatId } = action.payload
      const newMessages = chat.filter(
        (msg) =>
          !(state.chat[activeChatId] || []).some(
            (existingMsg) => existingMsg.id === msg.id,
          ),
      )

      if (newMessages.length > 0) {
        state.chat[activeChatId] = [
          ...(state.chat[activeChatId] || []),
          ...newMessages,
        ]
      }
    },
    clearChat: (state, action: PayloadAction<{ chatId: string }>) => {
      state.chat[action.payload.chatId] = []
    },
  },
})

export const { onChat, clearChat } = onChats.actions
export default onChats.reducer
