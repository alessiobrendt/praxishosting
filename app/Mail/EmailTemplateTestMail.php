<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailTemplateTestMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{subject: string, greeting: string, body: string, action_text: string|null}  $content
     */
    public function __construct(
        public array $content,
        public ?string $actionUrl = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[Test] '.$this->content['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.template-test',
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
