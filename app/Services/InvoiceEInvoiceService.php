<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

/**
 * Generates E-Invoice XML in XRechnung/UBL 2.1 style (minimal conformant set).
 * Stored under storage/app/invoices/{year}/{invoice_number}.xml
 */
class InvoiceEInvoiceService
{
    /**
     * Generate E-Invoice XML for an invoice and save to storage.
     *
     * @return string|null Relative path (e.g. "invoices/2026/INV-2026-00001.xml") or null on failure
     */
    public function generate(Invoice $invoice): ?string
    {
        $invoice->load(['user', 'siteSubscription.site']);

        $company = Setting::getInvoiceCompany($invoice->user?->brand);
        $supplierName = $company['company_name'];
        $supplierStreet = $company['company_street'];
        $supplierCity = $company['company_city'];
        $supplierPostal = $company['company_postal_code'];
        $supplierCountry = $company['company_country'];
        $supplierVatId = $company['company_vat_id'];

        $customerName = $invoice->user->company ?: $invoice->user->name;
        $customerStreet = $invoice->user->street ?? '';
        $customerCity = $invoice->user->city ?? '';
        $customerPostal = $invoice->user->postal_code ?? '';
        $customerCountry = $invoice->user->country ?? 'DE';

        $issueDate = $invoice->invoice_date->format('Y-m-d');
        $dueDate = $invoice->due_date?->format('Y-m-d');
        $amount = number_format((float) $invoice->amount, 2, '.', '');
        $currency = 'EUR';

        $description = 'Abonnement „Meine Seiten“';
        if ($invoice->siteSubscription && $invoice->siteSubscription->site) {
            $description .= ' – '.$invoice->siteSubscription->site->name;
        }
        if ($invoice->billing_period_start && $invoice->billing_period_end) {
            $description .= ' ('.$invoice->billing_period_start->format('d.m.Y').' – '.$invoice->billing_period_end->format('d.m.Y').')';
        }

        $supplierEmail = $company['company_email'] ?? config('mail.from.address', 'rechnung@example.com');
        $supplierTaxId = $company['company_tax_id'] ?? null;
        $supplierPhone = $company['company_phone'] ?? '';
        $supplierIban = $company['company_iban'] ?? '';
        $supplierBic = $company['company_bic'] ?? '';
        $supplierBankName = $company['company_bank_name'] ?? '';

        $xml = $this->buildUblInvoice(
            invoiceNumber: $invoice->number,
            issueDate: $issueDate,
            dueDate: $dueDate,
            currency: $currency,
            totalAmount: $amount,
            lineDescription: $description,
            lineAmount: $amount,
            supplierName: $supplierName,
            supplierStreet: $supplierStreet,
            supplierCity: $supplierCity,
            supplierPostalCode: $supplierPostal,
            supplierCountry: $supplierCountry,
            supplierVatId: $supplierVatId,
            supplierTaxId: $supplierTaxId,
            supplierEmail: $supplierEmail,
            supplierPhone: $supplierPhone,
            supplierIban: $supplierIban,
            supplierBic: $supplierBic,
            supplierBankName: $supplierBankName,
            ustgNote: $company['ustg_19_text'],
            customerName: $customerName,
            customerStreet: $customerStreet,
            customerCity: $customerCity,
            customerPostalCode: $customerPostal,
            customerCountry: $customerCountry,
            customerEmail: $invoice->user->email,
        );

        $year = $invoice->invoice_date->format('Y');
        $filename = str_replace(['/', ' '], ['-', '_'], $invoice->number).'.xml';
        $relativePath = "invoices/{$year}/{$filename}";

        Storage::put($relativePath, $xml);

        return $relativePath;
    }

    /**
     * Build UBL 2.1 / XRechnung-style invoice XML (EN 16931 / BR-DE compliant).
     *
     * @param  string|null  $supplierVatId  Rechnungssteller USt-IdNr. (BT-31)
     * @param  string|null  $supplierTaxId  Rechnungssteller Steuernummer (BT-32), falls keine USt-IdNr.
     * @param  string|null  $dueDate  Zahlbar bis (Y-m-d), für BR-CO-25
     */
    protected function buildUblInvoice(
        string $invoiceNumber,
        string $issueDate,
        ?string $dueDate,
        string $currency,
        string $totalAmount,
        string $lineDescription,
        string $lineAmount,
        string $supplierName,
        string $supplierStreet,
        string $supplierCity,
        string $supplierPostalCode,
        string $supplierCountry,
        ?string $supplierVatId,
        ?string $supplierTaxId,
        string $supplierEmail,
        string $supplierPhone,
        string $supplierIban,
        string $supplierBic,
        string $supplierBankName,
        string $ustgNote,
        string $customerName,
        string $customerStreet,
        string $customerCity,
        string $customerPostalCode,
        string $customerCountry,
        string $customerEmail,
    ): string {
        $esc = fn (string $s) => htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');

        $customizationId = 'urn:cen.eu:en16931:2017';
        $profileId = 'urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_2.3';
        $invoiceTypeCode = '380';
        $buyerRef = $esc($invoiceNumber);
        $dueDateXml = $dueDate !== null && $dueDate !== ''
            ? "\n  <cbc:DueDate>".$dueDate.'</cbc:DueDate>'
            : '';

        $partyIdentification = "\n      <cac:PartyIdentification>\n        <cbc:ID>".$esc($supplierName)."</cbc:ID>\n      </cac:PartyIdentification>";
        $supplierPartyLegalEntity = "\n      <cac:PartyLegalEntity>\n        <cbc:RegistrationName>".$esc($supplierName)."</cbc:RegistrationName>\n      </cac:PartyLegalEntity>";

        $partyTaxScheme = '';
        if ($supplierVatId !== null && $supplierVatId !== '') {
            $partyTaxScheme .= "\n      <cac:PartyTaxScheme>\n        <cbc:CompanyID>".$esc($supplierVatId)."</cbc:CompanyID>\n        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>\n      </cac:PartyTaxScheme>";
        }
        if (($supplierVatId === null || $supplierVatId === '') && $supplierTaxId !== null && $supplierTaxId !== '') {
            $partyTaxScheme .= "\n      <cac:PartyTaxScheme>\n        <cbc:CompanyID>".$esc($supplierTaxId)."</cbc:CompanyID>\n        <cac:TaxScheme><cbc:ID>FC</cbc:ID></cac:TaxScheme>\n      </cac:PartyTaxScheme>";
        }

        $supplierContact = "\n      <cac:Contact>\n        <cbc:ElectronicMail>".$esc($supplierEmail).'</cbc:ElectronicMail>';
        if ($supplierPhone !== '') {
            $supplierContact .= "\n        <cbc:Telephone>".$esc($supplierPhone).'</cbc:Telephone>';
        }
        $supplierContact .= "\n      </cac:Contact>";

        $buyerPartyLegalEntity = "\n      <cac:PartyLegalEntity>\n        <cbc:RegistrationName>".$esc($customerName)."</cbc:RegistrationName>\n      </cac:PartyLegalEntity>";

        $paymentTerms = $dueDate !== null && $dueDate !== ''
            ? "\n  <cac:PaymentTerms>\n    <cbc:Note>Zahlbar bis ".$dueDate."</cbc:Note>\n  </cac:PaymentTerms>"
            : "\n  <cac:PaymentTerms>\n    <cbc:Note>Siehe Rechnungsdatum</cbc:Note>\n  </cac:PaymentTerms>";

        $taxTotal = '  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="'.$currency.'">0.00</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="'.$currency.'">0.00</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>Z</cbc:ID>
        <cbc:Percent>0</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>';

        $payeeFinancialAccount = '';
        if ($supplierIban !== '') {
            $payeeFinancialAccount = "\n    <cac:PayeeFinancialAccount>\n      <cbc:ID>".$esc($supplierIban).'</cbc:ID>';
            if ($supplierBankName !== '') {
                $payeeFinancialAccount .= "\n      <cbc:Name>".$esc($supplierBankName).'</cbc:Name>';
            }
            if ($supplierBic !== '') {
                $payeeFinancialAccount .= "\n      <cac:FinancialInstitutionBranch>\n        <cac:FinancialInstitution>\n          <cbc:ID>".$esc($supplierBic)."</cbc:ID>\n        </cac:FinancialInstitution>\n      </cac:FinancialInstitutionBranch>";
            }
            $payeeFinancialAccount .= "\n    </cac:PayeeFinancialAccount>";
        }
        $paymentMeans = '  <cac:PaymentMeans>
    <cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>'.$payeeFinancialAccount.'
  </cac:PaymentMeans>';

        $xml = '<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>'.$esc($customizationId).'</cbc:CustomizationID>
  <cbc:ProfileID>'.$esc($profileId).'</cbc:ProfileID>
  <cbc:ID>'.$esc($invoiceNumber).'</cbc:ID>
  <cbc:IssueDate>'.$issueDate.'</cbc:IssueDate>'.$dueDateXml.'
  <cbc:InvoiceTypeCode>'.$invoiceTypeCode.'</cbc:InvoiceTypeCode>
  <cbc:Note>'.$esc($ustgNote).'</cbc:Note>
  <cbc:DocumentCurrencyCode>'.$currency.'</cbc:DocumentCurrencyCode>
  <cbc:BuyerReference>'.$buyerRef.'</cbc:BuyerReference>
  <cac:AccountingSupplierParty>
    <cac:Party>'.$partyIdentification.'
      <cac:PartyName><cbc:Name>'.$esc($supplierName).'</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>'.$esc($supplierStreet).'</cbc:StreetName>
        <cbc:CityName>'.$esc($supplierCity).'</cbc:CityName>
        <cbc:PostalZone>'.$esc($supplierPostalCode).'</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>'.$supplierCountry.'</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>'.$supplierPartyLegalEntity.$supplierContact.$partyTaxScheme.'
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>'.$esc($customerName).'</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>'.$esc($customerStreet).'</cbc:StreetName>
        <cbc:CityName>'.$esc($customerCity).'</cbc:CityName>
        <cbc:PostalZone>'.$esc($customerPostalCode).'</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>'.$customerCountry.'</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>'.$buyerPartyLegalEntity.'
      <cac:Contact><cbc:ElectronicMail>'.$esc($customerEmail).'</cbc:ElectronicMail></cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  '.$paymentMeans.'
  '.$paymentTerms.'
  '.$taxTotal.'
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="'.$currency.'">'.$lineAmount.'</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>'.$esc($lineDescription).'</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>Z</cbc:ID>
        <cbc:Percent>0</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="'.$currency.'">'.$lineAmount.'</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</Invoice>';

        return $xml;
    }
}
