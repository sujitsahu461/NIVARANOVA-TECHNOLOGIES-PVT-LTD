/** Opening line for WhatsApp chats started from the website. */
const WHATSAPP_GREETING = 'Hello NivaraNova Technologies, I found you through your website.'

/** "+91 76568 52710" → "tel:+917656852710" */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

/** WhatsApp's click-to-chat link: the number in international format, digits only, with a greeting ready. */
export function whatsappHref(number: string): string {
  const params = new URLSearchParams({ text: WHATSAPP_GREETING })
  return `https://wa.me/${number.replace(/\D/g, '')}?${params}`
}
