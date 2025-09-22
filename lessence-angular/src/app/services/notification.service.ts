import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationId = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  show(message: string, type: NotificationType = 'info', duration: number = 3000): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const notification = this.createNotificationElement(message, type);
    this.addToDOM(notification);
    this.animateIn(notification);
    this.scheduleRemoval(notification, duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  private createNotificationElement(message: string, type: NotificationType): HTMLElement {
    const notification = document.createElement('div');
    const id = `notification-${++this.notificationId}`;
    
    notification.id = id;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const baseStyles = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      max-width: 400px;
      word-wrap: break-word;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
    `;

    const typeStyles = this.getTypeStyles(type);
    notification.style.cssText = baseStyles + typeStyles;

    return notification;
  }

  private getTypeStyles(type: NotificationType): string {
    const styles = {
      success: 'background-color: #4caf50; border-left: 4px solid #2e7d32;',
      warning: 'background-color: #ff9800; border-left: 4px solid #f57c00;',
      error: 'background-color: #f44336; border-left: 4px solid #d32f2f;',
      info: 'background-color: #2196f3; border-left: 4px solid #1976d2;'
    };
    return styles[type] || styles.info;
  }

  private addToDOM(notification: HTMLElement): void {
    // Adiciona no final do body para garantir que apareça por cima de outros elementos
    document.body.appendChild(notification);
  }

  private animateIn(notification: HTMLElement): void {
    // Usa requestAnimationFrame para garantir que o elemento foi renderizado
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
  }

  private scheduleRemoval(notification: HTMLElement, duration: number): void {
    setTimeout(() => {
      this.animateOut(notification);
    }, duration);
  }

  private animateOut(notification: HTMLElement): void {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }
}
