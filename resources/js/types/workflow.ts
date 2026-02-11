export type WorkflowMeta = {
    id: string;
    name?: string;
    version?: string;
    saved_at?: string;
};

export type WorkflowNode = {
    id: string;
    type: string;
    label: string;
    x: number;
    y: number;
    config: Record<string, unknown>;
};

export type WorkflowEdge = {
    from: string;
    to: string;
    condition?: string;
};

export type Workflow = {
    meta: WorkflowMeta;
    variables_schema?: Record<string, string>;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
};

export type NodeTypeDef = {
    type: string;
    label: string;
    chip: string;
    desc: string;
    defaults: Record<string, unknown>;
};

export const NODE_TYPES: NodeTypeDef[] = [
    {
        type: 'trigger.form_submit',
        label: 'Kontaktformular',
        chip: 'Trigger',
        desc: 'Startet den Workflow, wenn ein Formular abgesendet wird.',
        defaults: {
            form_id: 'contact_form_1',
            required_fields: ['name', 'phone', 'email'],
            consent_required: true,
        },
    },
    {
        type: 'action.fonio_call',
        label: 'Fonio: Telefonisch Termin vereinbaren',
        chip: 'Action',
        desc: 'Ruft den Patienten an und bucht einen Termin (über Fonio/Assistent).',
        defaults: {
            assistant_id: 'fonio_assistant_x',
            phone_field: 'patient.phone',
            calendar_id: 'primary',
            retry: 2,
        },
    },
    {
        type: 'webhook.appointment_confirmed',
        label: 'Webhook: Termin bestätigt',
        chip: 'Webhook',
        desc: 'Wird ausgelöst, wenn Fonio/Kalender den Termin bestätigt.',
        defaults: {
            signature_check: true,
            map: {
                appointment_id: 'appointment.id',
                start: 'appointment.start',
                end: 'appointment.end',
            },
        },
    },
    {
        type: 'action.esign_request',
        label: 'eSign: Behandlungsverträge anfordern',
        chip: 'Action',
        desc: 'Sendet Behandlungsverträge zur eSignatur.',
        defaults: {
            provider: 'docusign_like',
            template_id: 'treat_contract_v1',
            recipient_email_field: 'patient.email',
            remind_after_hours: 24,
        },
    },
    {
        type: 'webhook.esign_completed',
        label: 'Webhook: eSign completed → Unterlagen prüfen + Summary',
        chip: 'Webhook',
        desc: 'Prüft Unterlagen, erstellt Zusammenfassung für das Backoffice.',
        defaults: {
            required_docs: ['Anamnesebogen', 'Datenschutz', 'Behandlungsvertrag'],
            summary_format: 'short',
            missing_doc_policy: 'flag',
        },
    },
    {
        type: 'action.backoffice_push',
        label: 'Backoffice: Ergebnisse übergeben',
        chip: 'Action',
        desc: 'Übergibt Daten/Zusammenfassung ins Backoffice (z.B. CSV-Import).',
        defaults: {
            mode: 'csv_drop',
            drop_folder: '/backoffice/import',
            field_map: { name: 'patient.name', phone: 'patient.phone' },
        },
    },
    {
        type: 'timer.reminder_call',
        label: 'Timer: Telefon-Erinnerung (T-1 Tag)',
        chip: 'Timer',
        desc: 'Ruft an, fragt ob Termin bleibt + ob Wegbeschreibung/FAQ benötigt wird.',
        defaults: {
            when: 'P1D',
            assistant_id: 'fonio_assistant_x',
            ask_directions: true,
            ask_questions: true,
        },
    },
    {
        type: 'timer.precheck_docs',
        label: 'Timer: Unterlagen-Check kurz vor Termin',
        chip: 'Timer',
        desc: 'Prüft ob Unterlagen vollständig; bittet fehlendes mitzubringen.',
        defaults: {
            when: 'PT3H',
            remind_channel: 'call',
            missing_docs_message:
                'Bitte bringen Sie die fehlenden Unterlagen zum Termin mit.',
        },
    },
    {
        type: 'action.backoffice_status_update',
        label: 'Backoffice: Status aktualisieren',
        chip: 'Action',
        desc: 'Setzt im Backoffice Status (vollständig/nachreichen) und Notiz.',
        defaults: {
            status_field: 'patient_status',
            note_field: 'note',
            status_complete: 'vollständig',
            status_missing: 'nachreichen',
        },
    },
];

export const DEFAULT_STEP_TYPES = [
    'trigger.form_submit',
    'action.fonio_call',
    'webhook.appointment_confirmed',
    'action.esign_request',
    'webhook.esign_completed',
    'action.backoffice_push',
    'timer.reminder_call',
    'timer.precheck_docs',
    'action.backoffice_status_update',
] as const;
