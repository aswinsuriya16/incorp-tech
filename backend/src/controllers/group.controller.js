import { createGroupService } from "../services/group.service.js";

export const createGroup = async (req, res) => {
  try {
    const group = await createGroupService(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
