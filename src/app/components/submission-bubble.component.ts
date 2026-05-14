import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-submission-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button
      type="button"
      class="submission-trigger"
      aria-label="Send a message"
      (click)="open()"
      data-magnetic
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
      <span class="submission-trigger__tooltip">send a message?</span>
    </button>

    @if (isOpen()) {
      <div class="submission-dialog" role="presentation" (click)="close()">
        <section
          class="submission-dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-title"
          (click)="$event.stopPropagation()"
        >
          <button
            type="button"
            class="submission-dialog__close"
            aria-label="Close message dialog"
            (click)="close()"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <h2 id="submission-title" class="submission-dialog__title font-display">
            Send a message
          </h2>

          <form class="submission-form" (ngSubmit)="submit()" novalidate>
            <label class="submission-field">
              <span>Message</span>
              <textarea
                name="content"
                [(ngModel)]="content"
                maxlength="2000"
                rows="6"
                required
                [disabled]="isSubmitting()"
              ></textarea>
            </label>

            <div class="submission-form__grid">
              <label class="submission-field">
                <span>Name</span>
                <input
                  name="name"
                  [(ngModel)]="name"
                  maxlength="80"
                  autocomplete="name"
                  [disabled]="isSubmitting()"
                />
              </label>

              <label class="submission-field">
                <span>Email</span>
                <input
                  name="email"
                  [(ngModel)]="email"
                  maxlength="200"
                  autocomplete="email"
                  [disabled]="isSubmitting()"
                />
              </label>
            </div>

            @if (statusMessage()) {
              <p
                class="submission-status"
                [class.submission-status--error]="statusKind() === 'error'"
                aria-live="polite"
              >
                {{ statusMessage() }}
              </p>
            }

            <button
              type="submit"
              class="submission-submit"
              [disabled]="isSubmitting() || !canSubmit()"
            >
              @if (isSubmitting()) {
                Sending
              } @else {
                Send
              }
            </button>
          </form>
        </section>
      </div>
    }
  `,
  styles: [
    `
      :host { display: contents; }

      .submission-trigger {
        position: fixed;
        right: 1rem;
        bottom: 5.1rem;
        z-index: 68;
        width: 3.25rem;
        height: 3.25rem;
        display: grid;
        place-items: center;
        border-radius: 9999px;
        background: rgba(10, 6, 8, 0.85);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.3s ease, color 0.3s ease;
      }
      .submission-trigger:hover {
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.5);
      }
      .submission-trigger svg {
        width: 1.25rem;
        height: 1.25rem;
      }
      .submission-trigger__tooltip {
        position: absolute;
        right: calc(100% + 0.75rem);
        top: 50%;
        transform: translateY(-50%) translateX(6px);
        padding: 0.45rem 0.7rem;
        border-radius: 6px;
        background: rgba(10, 6, 8, 0.94);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .submission-trigger:hover .submission-trigger__tooltip,
      .submission-trigger:focus-visible .submission-trigger__tooltip {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }

      @media (min-width: 768px) {
        .submission-trigger {
          left: 1.25rem;
          right: auto;
          bottom: 1.25rem;
          z-index: 55;
        }
        .submission-trigger__tooltip {
          left: calc(100% + 1rem);
          right: auto;
          transform: translateY(-50%) translateX(-6px);
        }
        .submission-trigger:hover .submission-trigger__tooltip,
        .submission-trigger:focus-visible .submission-trigger__tooltip {
          transform: translateY(-50%) translateX(0);
        }
      }

      .submission-dialog {
        position: fixed;
        inset: 0;
        z-index: 90;
        display: grid;
        place-items: end center;
        padding: 1rem;
        background: rgba(10, 6, 8, 0.72);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .submission-dialog__panel {
        position: relative;
        width: min(100%, 32rem);
        max-height: calc(100dvh - 2rem);
        overflow: auto;
        padding: 1.2rem;
        border-radius: 8px;
        background:
          linear-gradient(180deg, rgba(18, 10, 13, 0.96), rgba(10, 6, 8, 0.97)),
          #120a0d;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 28px 90px rgba(0, 0, 0, 0.62);
        animation: submissionPanelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @media (min-width: 768px) {
        .submission-dialog {
          place-items: center;
        }
        .submission-dialog__panel {
          padding: 1.4rem;
        }
      }
      @keyframes submissionPanelIn {
        from { opacity: 0; transform: translateY(16px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .submission-dialog__close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 2.25rem;
        height: 2.25rem;
        display: grid;
        place-items: center;
        border-radius: 9999px;
        color: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
      }
      .submission-dialog__close svg {
        width: 1rem;
        height: 1rem;
      }
      .submission-dialog__title {
        margin: 0 3rem 1.1rem 0;
        color: #fff;
        font-size: clamp(1.7rem, 5vw, 2.35rem);
        line-height: 1;
      }

      .submission-form {
        display: grid;
        gap: 0.9rem;
      }
      .submission-form__grid {
        display: grid;
        gap: 0.9rem;
      }
      @media (min-width: 640px) {
        .submission-form__grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .submission-field {
        display: grid;
        gap: 0.45rem;
      }
      .submission-field span {
        color: rgba(255, 255, 255, 0.62);
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .submission-field textarea,
      .submission-field input {
        width: 100%;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.055);
        color: #fff;
        outline: none;
        padding: 0.85rem;
        resize: vertical;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .submission-field textarea:focus,
      .submission-field input:focus {
        border-color: rgba(245, 158, 11, 0.62);
        background: rgba(255, 255, 255, 0.075);
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
      }
      .submission-field textarea:disabled,
      .submission-field input:disabled {
        opacity: 0.6;
      }

      .submission-status {
        min-height: 1.25rem;
        color: #57f287;
        font-size: 0.9rem;
      }
      .submission-status--error {
        color: #fb7185;
      }
      .submission-submit {
        justify-self: end;
        min-width: 7.5rem;
        min-height: 2.75rem;
        padding: 0.75rem 1.15rem;
        border-radius: 9999px;
        color: #0a0608;
        background: #f59e0b;
        font-weight: 700;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
          background 0.2s ease, opacity 0.2s ease;
      }
      .submission-submit:hover:not(:disabled) {
        transform: translateY(-1px);
        background: #fbbf24;
      }
      .submission-submit:disabled {
        opacity: 0.55;
      }
    `,
  ],
})
export class SubmissionBubbleComponent {
  content = '';
  name = '';
  email = '';
  isOpen = signal(false);
  isSubmitting = signal(false);
  statusKind = signal<'success' | 'error' | null>(null);
  statusMessage = signal('');

  constructor(private http: HttpClient) {}

  open() {
    this.isOpen.set(true);
    this.statusKind.set(null);
    this.statusMessage.set('');
  }

  close() {
    if (!this.isSubmitting()) {
      this.isOpen.set(false);
    }
  }

  submit() {
    const content = this.content.trim();
    const name = this.name.trim();
    const email = this.email.trim();

    if (content.length < 1) {
      this.showError('Message is required.');
      return;
    }

    if (content.length > 2000 || name.length > 80 || email.length > 200) {
      this.showError('One of the fields is too long.');
      return;
    }

    this.isSubmitting.set(true);
    this.statusKind.set(null);
    this.statusMessage.set('');

    this.http
      .post<{ ok: true }>('/api/submit', {
        content,
        ...(name ? { name } : {}),
        ...(email ? { contact: email } : {}),
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.content = '';
          this.name = '';
          this.email = '';
          this.statusKind.set('success');
          this.statusMessage.set('Sent.');
        },
        error: () => {
          this.showError('Could not send. Try again in a moment.');
        },
      });
  }

  canSubmit() {
    return this.content.trim().length > 0;
  }

  private showError(message: string) {
    this.statusKind.set('error');
    this.statusMessage.set(message);
  }
}
