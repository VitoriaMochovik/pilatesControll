import { Patient, Evolution, Falta } from '@/types';
import { formatDate } from '@/utils/helpers';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const pdfService = {
  generateHistoryHTML(patient: Patient, evolutions: Evolution[], faltas: Falta[]): HTMLElement {
    const allItems = [
      ...evolutions.map(e => ({ ...e, type: 'evolution' as const })),
      ...faltas.map(f => ({ ...f, type: 'falta' as const })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const evolutionsCount = evolutions.length;
    const faltasCount = faltas.length;
    const today = new Date().toLocaleDateString('pt-BR');

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; color: #333; background: white; padding: 40px; line-height: 1.6;">
        
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 4px solid #00786F; padding-bottom: 20px;">
          <h1 style="color: #00786F; font-size: 32px; margin: 0 0 5px 0;">PilatesControl</h1>
          <p style="color: #666; font-size: 14px; margin: 0;">Histórico de Aluno</p>
        </div>
        
        <div style="background: #f0f9f8; border: 2px solid #00786F; border-radius: 8px; padding: 20px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; color: #00786F; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Nome</span>
            <span style="font-size: 16px; color: #333; font-weight: 500;">${patient.name}</span>
          </div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; color: #00786F; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Idade</span>
            <span style="font-size: 16px; color: #333; font-weight: 500;">${patient.age} anos</span>
          </div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; color: #00786F; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Vencimento</span>
            <span style="font-size: 16px; color: #333; font-weight: 500;">Dia ${patient.payment_day}</span>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #00786F; margin-bottom: 5px;">${evolutionsCount}</div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Evoluções</div>
          </div>
          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #00786F; margin-bottom: 5px;">${faltasCount}</div>
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Faltas</div>
          </div>
        </div>
        
        <div style="font-size: 18px; font-weight: 700; color: #00786F; margin-top: 30px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #00786F;">Histórico Completo</div>
        
        ${allItems.length === 0 
          ? '<div style="text-align: center; padding: 30px; color: #999; font-style: italic;">Nenhum registro encontrado</div>' 
          : ''}
        
        ${allItems.map(item => {
          if (item.type === 'evolution') {
            const evolution = item as Evolution;
            return `
              <div style="background: white; border-left: 4px solid #00786F; border-radius: 4px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span style="font-weight: 600; color: #00786F; font-size: 13px;">${formatDate(evolution.date)}</span>
                  <div style="text-align: center;">
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; background: #d1f4f0; color: #00786F;">Evolução</span>
                  </div>
                </div>
                <div style="color: #555; font-size: 14px; line-height: 1.5; word-break: break-word;">${evolution.text}</div>
              </div>
            `;
          } else {
            const falta = item as Falta;
            return `
              <div style="background: white; border-left: 4px solid #ef4444; border-radius: 4px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span style="font-weight: 600; color: #00786F; font-size: 13px;">${formatDate(falta.date)}</span>
                  <div style="text-align: center;">
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; background: #fee2e2; color: #dc2626;">Falta</span>
                  </div>
                </div>
              </div>
            `;
          }
        }).join('')}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 5px 0;">Relatório gerado em ${today}</p>
          <p style="margin: 5px 0;">PilatesControl © 2026</p>
        </div>
      </div>
    `;

    return element;
  },

  async exportPDF(patient: Patient, evolutions: Evolution[], faltas: Falta[]): Promise<void> {
    try {
      const htmlElement = this.generateHistoryHTML(patient, evolutions, faltas);

      const opt = {
        margin: 10,
        filename: `historico_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' },
      };

      html2pdf().set(opt).from(htmlElement).save();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  },
};
