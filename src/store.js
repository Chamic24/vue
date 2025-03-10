// EventBus.js
import { reactive } from 'vue'
export const EventBus = reactive({
  emit(event, payload) {
    this[event] = payload
  },
  on(event, callback) {
    this[event] = callback
  }
})
