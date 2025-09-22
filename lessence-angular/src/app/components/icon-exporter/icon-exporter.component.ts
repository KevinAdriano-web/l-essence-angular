import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-icon-exporter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exporter-container">
      <h3>Exportar Ícone do Carrinho</h3>
      
      <div class="icon-preview" #iconPreview>
        <div class="cart-icon" [style.font-size.px]="iconSize">
          <span class="material-symbols-outlined">shopping_bag</span>
          <span class="cart-count" *ngIf="showCount">{{ cartCount }}</span>
        </div>
      </div>
      
      <div class="controls">
        <label>
          Tamanho: 
          <input type="range" 
                 min="16" 
                 max="128" 
                 [(ngModel)]="iconSize"
                 (input)="updateIcon()">
          {{ iconSize }}px
        </label>
        
        <label>
          <input type="checkbox" 
                 [(ngModel)]="showCount"
                 (change)="updateIcon()">
          Mostrar contador
        </label>
        
        <label>
          <input type="checkbox" 
                 [(ngModel)]="transparentBg"
                 (change)="updateIcon()">
          Fundo transparente
        </label>
      </div>
      
      <div class="export-buttons">
        <button (click)="exportAsPNG()" class="export-btn">
          Exportar como PNG
        </button>
        <button (click)="exportAsSVG()" class="export-btn">
          Exportar como SVG
        </button>
      </div>
    </div>
  `,
  styles: [`
    .exporter-container {
      padding: 20px;
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .icon-preview {
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      display: inline-block;
    }
    
    .cart-icon {
      position: relative;
      display: inline-block;
      color: #333;
    }
    
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: inherit;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    
    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #007cc9;
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 50%;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }
    
    .controls {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
    
    .controls label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    
    .export-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    
    .export-btn {
      padding: 10px 20px;
      background-color: #007cc9;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .export-btn:hover {
      background-color: #005fa3;
    }
  `]
})
export class IconExporterComponent {
  iconSize = 48;
  showCount = true;
  cartCount = 3;
  transparentBg = false;

  updateIcon() {
    // Força a atualização da view
    setTimeout(() => {
      // Lógica adicional se necessário
    }, 0);
  }

  exportAsPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = this.iconSize + 20; // Adiciona padding
    
    canvas.width = size;
    canvas.height = size;
    
    if (!this.transparentBg) {
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, size, size);
    }
    
    // Desenha o ícone usando texto
    ctx!.font = `${this.iconSize}px 'Material Symbols Outlined'`;
    ctx!.fillStyle = '#333';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    ctx!.fillText('shopping_bag', size / 2, size / 2);
    
    // Adiciona contador se necessário
    if (this.showCount) {
      const countSize = Math.max(12, this.iconSize / 4);
      ctx!.fillStyle = '#007cc9';
      ctx!.beginPath();
      ctx!.arc(size - countSize, countSize, countSize, 0, 2 * Math.PI);
      ctx!.fill();
      
      ctx!.fillStyle = 'white';
      ctx!.font = `${countSize}px Arial`;
      ctx!.textAlign = 'center';
      ctx!.fillText(this.cartCount.toString(), size - countSize, countSize);
    }
    
    // Converte para PNG e faz download
    const link = document.createElement('a');
    link.download = `carrinho-icon-${this.iconSize}px.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  exportAsSVG() {
    const size = this.iconSize + 20;
    const svgContent = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        ${!this.transparentBg ? `<rect width="${size}" height="${size}" fill="white"/>` : ''}
        <text x="${size/2}" y="${size/2}" 
              font-family="Material Symbols Outlined" 
              font-size="${this.iconSize}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              fill="#333">shopping_bag</text>
        ${this.showCount ? `
          <circle cx="${size - this.iconSize/4}" cy="${this.iconSize/4}" 
                  r="${this.iconSize/4}" fill="#007cc9"/>
          <text x="${size - this.iconSize/4}" y="${this.iconSize/4}" 
                font-family="Arial" 
                font-size="${this.iconSize/4}" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                fill="white">${this.cartCount}</text>
        ` : ''}
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `carrinho-icon-${this.iconSize}px.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}
