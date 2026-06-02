// features/session/sessionKeys.js
export const sessionKeys = {
    all: ['sessions'],
    lists: () => [...sessionKeys.all, 'list'],
    list: (classId: string ) => [...sessionKeys.lists(), classId],
    details: () => [...sessionKeys.all, 'detail'],
    detail: (id: string ) => [...sessionKeys.details(), id],
    attendance: (sessionId: string) => [...sessionKeys.all, 'attendance', sessionId],
}
