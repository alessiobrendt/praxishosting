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

        $company = Setting::getInvoiceCompany();
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
        $amount = number_format((float) $invoice->amount, 2, '.', '');
        $currency = 'EUR';

        $description = 'Abonnement „Meine Seiten“';
        if ($invoice->siteSubscription && $invoice->siteSubscription->site) {
            $description .= ' – '.$invoice->siteSubscription->site->name;
        }
        if ($invoice->billing_period_start && $invoice->billing_period_end) {
            $description .= ' ('.$invoice->billing_period_start->format('d.m.Y').' – '.$invoice->billing_period_end->format('d.m.Y').')';
        }

        $xml = $this->buildUblInvoice(
            invoiceNumber: $invoice->number,
            issueDate: $issueDate,
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
     * Build minimal UBL 2.1 / XRechnung-style invoice XML.
     *
     * @param  string|null  $supplierVatId  Rechnungssteller USt-IdNr. (z. B. DE123456789)
     */
    protected function buildUblInvoice(
        string $invoiceNumber,
        string $issueDate,
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
        string $ustgNote,
        string $customerName,
        string $customerStreet,
        string $customerCity,
        string $customerPostalCode,
        string $customerCountry,
        string $customerEmail,
    ): string {
        $partyTaxScheme = $supplierVatId
            ? "\n      <cac:PartyTaxScheme>\n        <cbc:CompanyID>".htmlspecialchars($supplierVatId, ENT_XML1, 'UTF-8')."</cbc:CompanyID>\n        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>\n      </cac:PartyTaxScheme>"
            : '';

        $xml = '<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017</cbc:CustomizationID>
  <cbc:ID>'.htmlspecialchars($invoiceNumber, ENT_XML1, 'UTF-8').'</cbc:ID>
  <cbc:IssueDate>'.$issueDate.'</cbc:IssueDate>
  <cbc:DocumentCurrencyCode>'.$currency.'</cbc:DocumentCurrencyCode>
  <cbc:Note>'.htmlspecialchars($ustgNote, ENT_XML1, 'UTF-8').'</cbc:Note>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>'.htmlspecialchars($supplierName, ENT_XML1, 'UTF-8').'</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>'.htmlspecialchars($supplierStreet, ENT_XML1, 'UTF-8').'</cbc:StreetName>
        <cbc:CityName>'.htmlspecialchars($supplierCity, ENT_XML1, 'UTF-8').'</cbc:CityName>
        <cbc:PostalZone>'.htmlspecialchars($supplierPostalCode, ENT_XML1, 'UTF-8').'</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>'.$supplierCountry.'</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>'.$partyTaxScheme.'
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>'.htmlspecialchars($customerName, ENT_XML1, 'UTF-8').'</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>'.htmlspecialchars($customerStreet, ENT_XML1, 'UTF-8').'</cbc:StreetName>
        <cbc:CityName>'.htmlspecialchars($customerCity, ENT_XML1, 'UTF-8').'</cbc:CityName>
        <cbc:PostalZone>'.htmlspecialchars($customerPostalCode, ENT_XML1, 'UTF-8').'</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>'.$customerCountry.'</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:Contact><cbc:ElectronicMail>'.htmlspecialchars($customerEmail, ENT_XML1, 'UTF-8').'</cbc:ElectronicMail></cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="'.$currency.'">'.$lineAmount.'</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>'.htmlspecialchars($lineDescription, ENT_XML1, 'UTF-8').'</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="'.$currency.'">'.$lineAmount.'</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="'.$currency.'">'.$totalAmount.'</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>';

        return $xml;
    }
}
