<?php

namespace App\Mail;

use App\Models\NewsletterPost;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterPostMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public NewsletterPost $post
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->post->subject,
            from: config('mail.from'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-post',
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
