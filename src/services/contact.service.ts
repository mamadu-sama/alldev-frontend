import api from "./api";

export interface ContactData {
  name: string;
  email: string;
  reason:
    | "general"
    | "bug"
    | "suggestion"
    | "security"
    | "partnership"
    | "press";
  subject: string;
  message: string;
  website?: string; // Honeypot field for bot detection
}

export interface ContactResponse {
  id: string;
  createdAt: string;
}

export const contactService = {
  async sendMessage(data: ContactData): Promise<ContactResponse> {
    const response = await api.post("/contact", data);
    return response.data.data;
  },
};
