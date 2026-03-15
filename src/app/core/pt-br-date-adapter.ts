import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class PtBrDateAdapter extends NativeDateAdapter {
  
  override parse(value: any): Date | null {
    // 1. Lida estritamente com a entrada de string no formato DD/MM/YYYY (digitação manual)
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      
      const parts = value.split('/');
      
      // Deve ter exatamente 3 partes (DD, MM, YYYY)
      if (parts.length === 3) {
          
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Mês no JS é 0-indexed (0 a 11)
          const year = parseInt(parts[2], 10);
          
          // Validação básica
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year >= 1000) {
            
            // Cria a data no fuso horário local
            const date = new Date(year, month, day);
            
            // CRÍTICO: Define a hora para o meio-dia (12:00:00) para neutralizar 
            // o impacto do fuso horário na mudança de dia.
            date.setHours(12, 0, 0, 0); 

            // Validação de correção: Garante que o JS não 'corrigiu' uma data inválida 
            // E que a data não foi invertida.
            if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
                if (!isNaN(date.getTime())) {
                    return date; // Retorna data válida
                }
            }
          }
      }
      
      // Se a string não for DD/MM/YYYY ou se falhar na validação/parsing:
      return null; 
    }
    
    // 2. Para Date objects e ISO strings (recebidos do backend ou datepicker):
    // Usamos o parser nativo, que é robusto para esses tipos.
    return super.parse(value);
  }
  
  // Garante que a data de saída seja formatada corretamente como DD/MM/YYYY
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;

        return `${pad(day)}/${pad(month)}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}