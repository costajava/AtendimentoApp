import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appDateMask]',
  standalone: true
})
export class DateMaskDirective implements OnInit, OnDestroy {
  @Input('appDateMask') maskPattern: string = 'd0/M0/0000';
  
  private inputListener?: () => void;
  private pasteListener?: () => void;
  private keydownListener?: () => void;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.setupMask();
  }

  ngOnDestroy(): void {
    // Limpa os listeners quando o componente é destruído
    if (this.inputListener) {
      this.inputListener();
    }
    if (this.pasteListener) {
      this.pasteListener();
    }
    if (this.keydownListener) {
      this.keydownListener();
    }
  }

  private setupMask(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    
    if (!input) {
      return;
    }

    // Adiciona event listener para aplicar máscara em tempo real
    this.inputListener = this.addEventListener(input, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      
      // Se o valor já está no formato DD/MM/YYYY, não aplica máscara
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(target.value)) {
        return;
      }
      
      const maskedValue = this.applyMask(target.value);
      
      if (target.value !== maskedValue) {
        target.value = maskedValue;
        // Dispara evento de input para atualizar o form control
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Adiciona event listener para limpar caracteres inválidos no paste
    this.pasteListener = this.addEventListener(input, 'paste', (event: Event) => {
      const clipboardEvent = event as ClipboardEvent;
      clipboardEvent.preventDefault();
      const pastedData = clipboardEvent.clipboardData?.getData('text') || '';
      const cleanedData = pastedData.replace(/\D/g, '');
      const maskedValue = this.applyMask(cleanedData);
      
      input.value = maskedValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Previne entrada de caracteres não numéricos
    this.keydownListener = this.addEventListener(input, 'keydown', (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      // Permite teclas de controle
      if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) {
        return;
      }
      
      // Permite teclas especiais
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (allowedKeys.includes(keyboardEvent.key)) {
        return;
      }
      
      // Permite apenas números
      if (!/^[0-9]$/.test(keyboardEvent.key)) {
        keyboardEvent.preventDefault();
      }
    });
  }

  private addEventListener(element: HTMLElement, event: string, handler: (event: Event) => void): () => void {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }

  private applyMask(value: string): string {
    if (!value) {
      return '';
    }

    // Remove tudo que não é dígito
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos (DDMMYYYY)
    if (digitsOnly.length > 8) {
      return digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2, 4) + '/' + digitsOnly.substring(4, 8);
    }

    // Aplica máscara progressivamente
    let maskedValue = '';
    if (digitsOnly.length > 0) {
      if (digitsOnly.length <= 2) {
        maskedValue = digitsOnly;
      } else if (digitsOnly.length <= 4) {
        maskedValue = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2);
      } else {
        maskedValue = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2, 4) + '/' + digitsOnly.substring(4);
      }
    }

    return maskedValue;
  }
}