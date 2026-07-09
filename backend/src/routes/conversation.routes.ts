import { Router } from "express";

import {
  createOrGetConversation,
  listConversations,
  listMessages,
  sendMessageRest,
} from "../controllers/conversation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createConversationSchema } from "../validators/conversation.validators";
import { sendMessageSchema } from "../validators/message.validators";

const router = Router();

router.get("/", requireAuth, listConversations);
router.post("/", requireAuth, validate(createConversationSchema), createOrGetConversation);
router.get("/:id/messages", requireAuth, listMessages);
router.post("/:id/messages", requireAuth, validate(sendMessageSchema), sendMessageRest);

export default router;
