import { getSnapshot } from "~~/server/utils/parkingState";

export default defineEventHandler(() => {
    return { slots: getSnapshot() };
});
