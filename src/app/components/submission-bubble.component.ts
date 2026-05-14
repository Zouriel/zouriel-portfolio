import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

const HINT_SESSION_KEY = 'sb_hinted_v1';

@Component({
  selector: 'app-submission-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button
      type="button"
      class="submission-trigger"
      [class.is-hinted]="hinted()"
      [attr.aria-label]="'Leave me a note — anonymous or signed'"
      (click)="open()"
      (mouseenter)="dismissHint()"
      data-magnetic
    >
      <span class="submission-trigger__icon" aria-hidden="true">
        <span class="submission-trigger__pulse"></span>
        <span class="submission-trigger__pulse submission-trigger__pulse--lag"></span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
        </svg>
      </span>
      <span class="submission-trigger__label">
        <span class="submission-trigger__label-line">Leave a note</span>
        <span class="submission-trigger__label-sub">anon · or signed</span>
      </span>
      <span class="submission-trigger__tooltip">leave a note?</span>
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
            aria-label="Close note"
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

          <p class="submission-dialog__eyebrow">// drop box</p>
          <h2 id="submission-title" class="submission-dialog__title font-display">
            Leave me a note
          </h2>
          <p class="submission-dialog__intro">
            A thought, a question, a job lead, or just a hello.
            Sign it or stay anonymous — your call.
          </p>

          <form class="submission-form" (ngSubmit)="submit()" novalidate>
            <label class="submission-field">
              <span>Your message</span>
              <textarea
                name="content"
                [(ngModel)]="content"
                maxlength="2000"
                rows="6"
                required
                placeholder="Type whatever you want me to read..."
                [disabled]="isSubmitting()"
              ></textarea>
            </label>

            <div class="submission-identity">
              <div
                class="submission-identity__badge"
                [class.is-signed]="identityShown()"
                aria-live="polite"
              >
                <span class="submission-identity__dot" aria-hidden="true"></span>
                @if (identityShown()) {
                  <span>Sending as <strong>{{ displayIdentity() }}</strong></span>
                } @else {
                  <span>Sending anonymously</span>
                }
              </div>
              <button
                type="button"
                class="submission-identity__toggle"
                (click)="toggleIdentity()"
                [disabled]="isSubmitting()"
              >
                @if (identityShown()) {
                  Make anonymous
                } @else {
                  + Sign it
                }
              </button>
            </div>

            @if (identityShown()) {
              <div class="submission-form__grid">
                <label class="submission-field">
                  <span>Name <em>optional</em></span>
                  <input
                    name="name"
                    [(ngModel)]="name"
                    maxlength="80"
                    autocomplete="name"
                    placeholder="What should I call you?"
                    [disabled]="isSubmitting()"
                  />
                </label>

                <label class="submission-field">
                  <span>Email <em>optional</em></span>
                  <input
                    name="email"
                    [(ngModel)]="email"
                    maxlength="200"
                    autocomplete="email"
                    placeholder="Only if you want a reply"
                    [disabled]="isSubmitting()"
                  />
                </label>
              </div>
            }

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
                Send it
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
        height: 3.25rem;
        min-width: 3.25rem;
        display: inline-flex;
        align-items: center;
        flex-direction: row-reverse;
        padding: 0;
        border-radius: 9999px;
        background: rgba(10, 6, 8, 0.85);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        transition:
          padding 0.45s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.3s ease,
          color 0.3s ease,
          box-shadow 0.3s ease,
          background 0.3s ease;
      }
      .submission-trigger:hover {
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.5);
      }

      .submission-trigger__icon {
        position: relative;
        flex: 0 0 3.25rem;
        width: 3.25rem;
        height: 3.25rem;
        display: grid;
        place-items: center;
      }
      .submission-trigger__icon svg {
        width: 1.2rem;
        height: 1.2rem;
        position: relative;
        z-index: 2;
        transform: translate(-1px, 1px);
      }

      .submission-trigger__pulse {
        position: absolute;
        inset: 0.4rem;
        border-radius: 9999px;
        border: 1px solid rgba(245, 158, 11, 0.55);
        opacity: 0;
        pointer-events: none;
      }
      .submission-trigger.is-hinted .submission-trigger__pulse {
        animation: submissionPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      }
      .submission-trigger.is-hinted .submission-trigger__pulse--lag {
        animation-delay: 1.2s;
      }
      @keyframes submissionPulse {
        0%   { transform: scale(0.85); opacity: 0.85; border-color: rgba(245,158,11,0.55); }
        80%  { transform: scale(2.0);  opacity: 0;    border-color: rgba(245,158,11,0); }
        100% { transform: scale(2.0);  opacity: 0;    border-color: rgba(245,158,11,0); }
      }

      .submission-trigger__label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        max-width: 0;
        overflow: hidden;
        white-space: nowrap;
        opacity: 0;
        padding: 0;
        transition:
          max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.3s ease,
          padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .submission-trigger__label-line {
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.005em;
        line-height: 1.15;
      }
      .submission-trigger__label-sub {
        color: rgba(245, 158, 11, 0.95);
        font-family: "JetBrains Mono", monospace;
        font-size: 9.5px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        margin-top: 2px;
      }

      .submission-trigger.is-hinted {
        border-color: rgba(245, 158, 11, 0.55);
        background: linear-gradient(135deg, rgba(22, 12, 14, 0.95), rgba(10, 6, 8, 0.95));
        color: #f59e0b;
        animation: submissionGlow 2.2s ease-in-out infinite alternate;
      }
      .submission-trigger.is-hinted .submission-trigger__label {
        max-width: 13rem;
        opacity: 1;
        padding: 0 0.95rem;
      }
      .submission-trigger.is-hinted .submission-trigger__tooltip {
        opacity: 0 !important;
      }
      @keyframes submissionGlow {
        from {
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(245, 158, 11, 0.18),
            0 0 14px rgba(245, 158, 11, 0.18);
        }
        to {
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(245, 158, 11, 0.4),
            0 0 28px rgba(245, 158, 11, 0.32);
        }
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
          flex-direction: row;
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

      @media (prefers-reduced-motion: reduce) {
        .submission-trigger,
        .submission-trigger__label,
        .submission-trigger__pulse {
          animation: none !important;
          transition: none !important;
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

      .submission-dialog__eyebrow {
        margin: 0 0 0.45rem;
        color: #f59e0b;
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
      }
      .submission-dialog__title {
        margin: 0 3rem 0.55rem 0;
        color: #fff;
        font-size: clamp(1.7rem, 5vw, 2.35rem);
        line-height: 1;
      }
      .submission-dialog__intro {
        margin: 0 0 1.1rem;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.92rem;
        line-height: 1.55;
        max-width: 36ch;
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
      .submission-field span em {
        font-style: normal;
        color: rgba(255, 255, 255, 0.32);
        margin-left: 0.4rem;
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
      .submission-field textarea::placeholder,
      .submission-field input::placeholder {
        color: rgba(255, 255, 255, 0.28);
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

      .submission-identity {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.65rem 0.85rem;
        background: rgba(255, 255, 255, 0.025);
        border: 1px dashed rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        transition: border-color 0.25s ease, background 0.25s ease;
      }
      .submission-identity:has(.is-signed) {
        border-style: solid;
        border-color: rgba(245, 158, 11, 0.32);
        background: rgba(245, 158, 11, 0.05);
      }
      .submission-identity__badge {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        font-family: "JetBrains Mono", monospace;
        font-size: 10.5px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.72);
        min-width: 0;
      }
      .submission-identity__badge span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .submission-identity__badge strong {
        color: #fff;
        font-weight: 600;
      }
      .submission-identity__dot {
        flex: 0 0 auto;
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.45);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
        transition: background 0.25s ease, box-shadow 0.25s ease;
      }
      .submission-identity__badge.is-signed {
        color: rgba(255, 255, 255, 0.92);
      }
      .submission-identity__badge.is-signed .submission-identity__dot {
        background: #f59e0b;
        box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
      }
      .submission-identity__toggle {
        flex: 0 0 auto;
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #f59e0b;
        padding: 0.4rem 0.65rem;
        border-radius: 6px;
        border: 1px solid rgba(245, 158, 11, 0.32);
        background: rgba(245, 158, 11, 0.06);
        transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      }
      .submission-identity__toggle:hover:not(:disabled) {
        background: rgba(245, 158, 11, 0.14);
        border-color: rgba(245, 158, 11, 0.55);
      }
      .submission-identity__toggle:disabled {
        opacity: 0.5;
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
export class SubmissionBubbleComponent implements OnInit, OnDestroy {
  content = '';
  name = '';
  email = '';
  isOpen = signal(false);
  isSubmitting = signal(false);
  statusKind = signal<'success' | 'error' | null>(null);
  statusMessage = signal('');
  hinted = signal(false);
  identityShown = signal(false);

  private hintTimer?: ReturnType<typeof setTimeout>;
  private collapseTimer?: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (sessionStorage.getItem(HINT_SESSION_KEY)) return;
    } catch {}

    this.hintTimer = setTimeout(() => {
      this.hinted.set(true);
      this.collapseTimer = setTimeout(() => this.dismissHint(), 5200);
    }, 2900);
  }

  ngOnDestroy() {
    if (this.hintTimer) clearTimeout(this.hintTimer);
    if (this.collapseTimer) clearTimeout(this.collapseTimer);
  }

  dismissHint() {
    if (this.collapseTimer) {
      clearTimeout(this.collapseTimer);
      this.collapseTimer = undefined;
    }
    if (!this.hinted()) return;
    this.hinted.set(false);
    try { sessionStorage.setItem(HINT_SESSION_KEY, '1'); } catch {}
  }

  open() {
    this.dismissHint();
    this.isOpen.set(true);
    this.statusKind.set(null);
    this.statusMessage.set('');
  }

  close() {
    if (!this.isSubmitting()) {
      this.isOpen.set(false);
    }
  }

  toggleIdentity() {
    const next = !this.identityShown();
    this.identityShown.set(next);
    if (!next) {
      this.name = '';
      this.email = '';
    }
  }

  displayIdentity(): string {
    const name = this.name.trim();
    return name || 'you';
  }

  submit() {
    const content = this.content.trim();
    const name = this.identityShown() ? this.name.trim() : '';
    const email = this.identityShown() ? this.email.trim() : '';

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
          this.statusMessage.set('Sent. Thanks.');
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
