export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('55') ? cleaned : '55' + cleaned;
}

export function openWhatsAppChat(phoneNumber: string, patientName: string, dueDay: number): void {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  
  // Usar emojis literais - arquivo DEVE estar em UTF-8
  const message = `Olá ${patientName}, tudo bem? 

⚠ Sua mensalidade do PILATES / FISIOTERAPIA encontra-se em aberto. 

💰 Venceu no dia ${dueDay}. 

📌 Mensagem automática 

Att: OrtoFisio`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send/?phone=${formattedPhone}&text=${encodedMessage}`;
  
  console.log('🔗 WhatsApp URL:', url);
  console.log('📱 Phone:', formattedPhone);
  
  window.open(url, '_blank');
}

// Suas funções de data e moeda permanecem iguais abaixo...
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function getMonthName(dayOfMonth: number): string {
  const today = new Date();
  const currentDay = today.getDate();

  const targetDate = dayOfMonth >= currentDay 
    ? today 
    : new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const monthStr = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(targetDate);
  return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
}