# BIR closure / cancellation of registration for a self-employed freelancer: official source findings

Research date: 2026-10-22. Read-only web research. No sign-ins, no forms submitted. Official BIR PDFs were downloaded locally only to read them.

Persona: individual, self-employed / professional (virtual assistant, possibly mixed-income), head-office registration, wants to permanently close her BIR business registration.

Note on quoting: Philippine government issuances are not copyrighted (RA 8293 Sec. 176), so short verbatim quotes below are safe to reuse in the app. Quotes marked (OCR-verified) came from scanned PDFs; I transcribed them with macOS Vision OCR and then checked them by eye against rendered page images.

---

## 0. Bottom line (read this first)

1. The transaction is **closure of business / cancellation of business registration** (BIR's own phrasing: "Closure and/or Cancellation of Business Registration"; Citizen's Charter title: "Application for Closure of Business - Head Office ..."). The form is **BIR Form No. 1905**, "Application for Registration Information Update/Correction/Cancellation" (current edition: **October 2025 (ENCS)**). Confirmed.
2. The **controlling, newest rule** is **RMC No. 47-2026 (19 May 2026, effective immediately)**. It explicitly covers "Individual taxpayers engaged in trade or business or in the practice of profession, whether self-employed or professionals, including those earning income from digital or online platforms". It sets a short, closed list of documents ("Only the following documents shall be submitted"), allows e-filing for part of it, and says penalties for non-filing "shall not accrue" once the documents are submitted.
3. The **Citizen's Charter 2026 (1st Edition)** has the step-by-step "client steps / fees / processing time" tables. The right entry for her is **#28-A "Application for Closure of Business - Head Office Not Subject to Audit with Issuance of Tax Clearance"**. It was published BEFORE RMC 47-2026 and differs on audit thresholds and on the ending-inventory requirement (see Section 8). Where they conflict, RMC 47-2026 is later and its repealing clause (Sec. 8) overrides inconsistent rules.
4. **Fee: PHP 30.00** (loose documentary stamp on the Tax Clearance Certificate). **Processing: "3 Days"** (Citizen's Charter) / Tax Clearance "within three (3) working days" (RMC 47-2026, micro taxpayers). The **PHP 500 annual registration fee no longer exists** (abolished 22 Jan 2024).
5. **Penalties**: no official source gives a case-specific amount. RMC 47-2026 stops further accrual after submission. There is a time-limited relief program (**RR 4-2026 + RMC 84-2026: one-time abatement for micro taxpayers, PHP 5,000 per taxable year, filing deadline 31 Dec 2026**) that expressly covers open stop-filer cases of taxpayers who have ceased business and can be used to support the closure application.
6. **No cross-office document** (mayor's permit closure, barangay, DTI) is required by any BIR source found.
7. **Public accessibility**: PDFs are on `bir-cdn.bir.gov.ph` and fetchable. BIR web pages are JavaScript-rendered (empty to a plain HTTP fetch). The RMC 47-2026 full-text PDF is a **scanned image with a garbled text layer**; the "Digest" PDF is clean text.

---

## 1. Official name of the transaction and the form

| Item | Finding | Source | Confidence |
|---|---|---|---|
| Transaction name (law/regulation level) | "Cancellation of Registration" (RR 7-2024 Sec. 5(J)); RA 11976 Sec. 34 amending NIRC Sec. 236(E) "Cancellation of Registration" | RR 7-2024; RA 11976 | High |
| Transaction name (current BIR circular) | "Closure and/or Cancellation of Business Registration" (RMC 47-2026 subject line: "Prescribing Simplified and Streamlined Guidelines and Procedures in the Closure and/or Cancellation of Business Registration with the Bureau of Internal Revenue") | RMC 47-2026 | High |
| Citizen's Charter service name | "28-A. Application for Closure of Business - Head Office Not Subject to Audit with Issuance of Tax Clearance" (labelled "(New)" in the BIR list); also "28. Application for Closure of Business - Head Office Subject to Audit with Issuance of Tax Clearance (Excluding the Audit Process Processing Time)" (labelled "(With Updates)") | Citizen's Charter 2026; BIR HTML pages | High |
| Form | **BIR Form No. 1905**, "Application for Registration Information Update/Correction/Cancellation", edition "October 2025 (ENCS) P1". 2 original copies required. | RMC 47-2026 Sec. 4(1); Form 1905 PDF; BIR Forms page | High |
| Which boxes on Form 1905 | Item 6 "Other Updates": tick "Closure of Business (proceed to Number 8)". Item 8 "Closure of Business/Cancellation of Registration", part **B. "DE-REGISTER/CESSATION OF REGISTRATION OF BUSINESS"**: tick "Permanent closure of business (head office) of an individual", fill "Trade/Business Name" and "Effectivity Date of Cessation (MM/DD/YYYY)". Part 8.A "Cancellation of TIN" lists Death, Multiple/Identical TIN, "Permanent closure of a branch", "Permanent closure of business operations (Non-Individual)" and "Others"; none is the individual-closure box. Item 12 is the sworn declaration with signature. (Checked on rendered form image.) | Form 1905 Oct 2025, pp. 1-3 | High |
| BIR's own description of 1905 | "This form shall be accomplished by all taxpayers who intend to update/change any data or information, e.g. transfer of business within the same RDO, change in registered activities, cancellation of business registration due to closure of business or transfer to other district, or replacement of lost TIN Card/ Certificate of Registration." "Shall be filed with the RDO having jurisdiction over the taxpayer, whether Head Office or branch." | BIR Forms page, 1905 entry | High |
| Closure checklist on the form itself | Page 4 of the form: heading "CLOSURE OF BUSINESS (HEAD OFFICE/BRANCH), CANCELLATION OF TIN/ REGISTRATION DUE TO DISSOLUTION, MERGER OR CONSOLIDATION" (list in Sec. 2 below) | Form 1905 PDF p. 4 | High |
| The TIN | RMC 47-2026 Sec. 6: "The updating of the registration status to 'Closed' shall complete the closure or business registration cancellation process for individual taxpayers. For non-individual taxpayers, the TIN shall subsequently be cancelled". So for an individual, closure ends at status "Closed"; the TIN is not stated to be cancelled. (The Citizen's Charter steps say "cancel/deregister TIN, if applicable".) | RMC 47-2026 Sec. 6; CC step 11.5 | Medium-High (inference that her TIN stays) |

Legal base (for the app's "why"):
- RA 11976 (EOPT Act) Sec. 34 amending NIRC Sec. 236(E)(1): "The registration of any person shall be cancelled upon mere filing, either electronically or manually," with the RDO "an application for registration information update in a form prescribed therefor." Also: "this shall not preclude the Commissioner of the Internal Revenue or his authorized representative from conducting an audit in order to determine any tax liability". URL: https://lawphil.net/statutes/repacts/ra2024/ra_11976_2024.html (Lawphil copy; the Official Gazette copy returned 403 to my fetch). Approved 5 Jan 2024, published 7 Jan 2024, effective 22 Jan 2024 (BIR flyer: https://bir-cdn.bir.gov.ph/BIR/pdf/flyer-eopt.pdf). Confidence: High.
- RR 7-2024 (11 Apr 2024), Sec. 5(J), same wording: "The registration of any person shall be cancelled upon mere filing, either electronically or manually, of an application for registration information update in a form prescribed therefor with the RDO where such person is registered." URL: https://bir-cdn.bir.gov.ph/BIR/pdf/RR%20No.%207-%202024.pdf (scanned; OCR-verified). Confidence: High.
- RMC 47-2026 Sec. 1 says it is issued "Pursuant to Section 5(J) of Revenue Regulations No. 7-2024 and Revenue Memorandum Circular No. 91-2024".

---

## 2. Official list of documentary requirements (and which are conditional)

### 2.1 Controlling list: RMC No. 47-2026, Sec. 4 (OCR-verified against page image)

URL (full text, scanned): https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026.pdf
URL (digest, clean text): https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026%20Digest.pdf
Date: 19 May 2026 (stamped "MAY 19 2026"; PDF created 2026-05-19; BIR RMC listing shows "May 19, 2026"). Effectivity Sec. 9: "This Circular shall take effect immediately."

Lead-in: "Only the following documents shall be submitted for the closure and/or cancellation of taxpayer's business registration with the BIR:"

| # | Requirement (RMC 47-2026 wording) | Always or conditional? | Where to secure | Notes |
|---|---|---|---|---|
| 1 | "Application for Registration Information Update/Correction/Cancellation (BIR Form No. 1905) (2 original copies);" | **Always** | CC: "RDO - Client Support Section Area" or "Download at BIR website (www.bir.gov.ph)" | Fillable PDF at https://bir-cdn.bir.gov.ph/BIR/pdf/1905%20October%202025%20ENCS%20Final.pdf |
| 2 | "List of ending inventory of goods and supplies, including capital goods, for VAT-registered taxpayers (1 original copy);" | **Conditional: only "for VAT-registered taxpayers"** | CC: "Taxpayer-applicant" | CC / Form 1905 / CDR / RMC 91-2024 list it WITHOUT the VAT qualifier. RMC 47-2026 is newer. See Sec. 8. |
| 3 | "Unused invoices/supplementary documents and all other unutilized accounting forms such as vouchers, debit/credit memos, delivery receipts, purchase orders, etc., as may be applicable, together with the Inventory thereof; and" | **Conditional: "as may be applicable"** (only if the taxpayer has such unused forms) | CC: "Taxpayer-applicant" | Must be "submitted manually" (Sec. 3 proviso). CC note: "Destruction of unused sales invoices/official receipts and other accounting forms is a separate process outside the scope of this service." |
| 4 | "Original BIR Notices and BIR Permits issued to taxpayer, as may be applicable:" a. "Certificate of Registration (COR)/Electronic COR (BIR Form No. 2303);" b. "Authority To Print;" c. "Notice to Issue Invoice;" d. "Accreditation Certificate and Permit to Use - for Cash Register Machine/Point-of-Sales; and" e. "Electronic Invoicing/Receipting System (EIS) Certificate and Permit to Transmit." | **Conditional: "as may be applicable"** (the COR is the one every registrant has; b-e only if she ever got them) | CC: "Taxpayer-applicant" | Must be "submitted manually" (Sec. 3 proviso). Unclear how an eCOR (a PDF) is "surrendered" (see Sec. 8). |
| 5 | "For applications filed by a representative of the taxpayer:" a. "For individual taxpayer: Notarized Special Power of Attorney executed by the taxpayer-applicant, specifically authorizing the representative to process the application for the closure and/or cancellation of the taxpayer's registration and photocopy of any government-issued ID of the taxpayer and of the authorized representative, both with original specimen signature." | **Conditional: only if someone else files for her** | CC: SPA from "Taxpayer-applicant being represented"; ID from "Taxpayer-applicant/ Authorized Representative" | CC adds: SPA "1 original for first time submission"; ID "1 photocopy, both with one original specimen signature (wet)". |
| 5c | "For closure and/or cancellation due to the death of an individual proprietor: Death Certificate and any competent document/s ... evidencing the authority of the heir/executor/ administrator" | Conditional: death only | n/a to this persona | |
| 5b | Non-individual (Board Resolution / Secretary's Certificate) | Conditional: not applicable to her | n/a | |

Related process requirement (not a "document" but mandatory), RMC 47-2026 Sec. 5: "The taxpayer shall file all final or short-period tax returns covering the period from the beginning of the taxable year up to the date of closure for all applicable tax types and pay the corresponding taxes due thereon. For periods during which there was no business activity, the taxpayer shall file zero returns."

What is NOT on the official list: no books of accounts, no letter of request/reason for closure, no Mayor's permit/DTI/barangay papers, no ID for a self-filing taxpayer (ID is only listed with the representative case), no payment of annual registration fee. (The DTI page, unofficial for this purpose, lists a letter and books of accounts: see Sec. 8.)

### 2.2 Older / parallel lists (same content, less precise)
- Citizen's Charter #28-A "CHECKLIST OF REQUIREMENTS / WHERE TO SECURE": items 1-4 above without the VAT qualifier or "as may be applicable" on item 2; item 3 reads "Inventory of unused invoices/supplementary invoices, together with Unused invoices/supplementary invoices and all other unutilized accounting forms"; item 4 reads "Original copy of BIR Notices and Permits (e.g. ATP; NIRI; Accreditation Certificate and Permit to Use - for CRM/POS; etc.) issued to taxpayer as well as original copy of the BIR Certificate of Registration (COR)/Electronic COR". Header for the representative block: "ADDITIONAL DOCUMENTS, IF APPLICABLE TO THE FOLLOWING CASES: 1. If transacting through a Representative".
- Form 1905 (Oct 2025), p. 4: same four items under the closure heading, "FEES TO BE PAID 1. Fee: P30.00 Loose Stamp (DST) to be affixed to the Tax Clearance Certificate issued for closure of business." and "ADDITIONAL DOCUMENTS, IF APPLICABLE: 1. If transacting through a Representative".
- BIR Checklist of Documentary Requirements, CDR F1105C "APPLICATION FOR CANCELLATION OF TIN" (marked "REVISED JUL2025"), https://bir-cdn.bir.gov.ph/BIR/pdf/CDR%20-%202025%20(1).pdf (PDF last modified 18 Jul 2025): same four items, same P30 fee line ("Payment of P30.00 Loose Stamp/s (DST) to be affixed to the Tax Clearance Certificate issued for closure of business."). It is a cover sheet the RDO has the client sign. Its important rule: "Processing of transactions commences only upon submission of complete documents. INCOMPLETE REQUIREMENTS WILL BE RETURNED TO APPLICANT/WILL NOT BE PROCESSED."
- RMC 91-2024 (14 Aug 2024), Q14 "How will I close my business registration with the BIR?": "Closure of business registration may be done by mere filing of application (using BIR Form No. 1905), with complete documentary requirements" (same 4 items), then: "However, this shall not preclude the Commissioner of Internal Revenue or his authorized representative from conducting audit in order to determine the tax liability of taxpayer as of closure of his/her/its business operations. Said tax liability needs to be settled prior to the issuance of tax clearance for business closure." URL: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2091-2024.pdf (scanned; OCR-verified). Partly superseded by RMC 47-2026.

Confidence for Sec. 2: High on the items; High that the VAT/"as applicable" conditions are in the newer RMC; Medium on how the RDO will treat them in practice.

---

## 3. Client steps as published (Citizen's Charter, entry 28-A)

Sources:
- PDF: "BIR Citizen's Charter (2026 Edition)" 1st Edition. Two files on the BIR CDN with identical 28-A content:
  - https://bir-cdn.bir.gov.ph/BIR/pdf/BIR%20Citizen's%20Charter%20(2026%20Edition)%20final.pdf (505 pp; created 2026-03-30; Last-Modified 2026-04-01; this is the file the BIR homepage links to as "BIR Citizen's Charter"). 28-A is on PDF pp. ~87-90.
  - https://bir-cdn.bir.gov.ph/BIR/pdf/BIR%20Citizen's%20Charter%20(2026%20Edition)v2.pdf (506 pp; created and Last-Modified 2026-04-23). 28-A is on PDF pp. 91-94 (printed pp. 82-85; its Table of Contents lists wrong page numbers 71 and 76).
- HTML (JS-rendered): https://www.bir.gov.ph/BIRCC-RDO-External-Service-28A (I read it in a browser; text matches the PDF). Index: https://www.bir.gov.ph/citizencharter (lists 28, 28-A, 28-B, 28-C as /BIRCC-RDO-External-Service-28, -28A, -28B, -28C).

Header facts (quoted):
- "Registered business taxpayers shall file Application for Closure of Business to inform the BIR of its cessation of business operation and in order for the RDO to verify if taxpayer has any Open Case/s and/or tax liabilities that need to be settled prior to the issuance of a Tax Clearance."
- Where to apply: "RDO where the Head Office is registered" (regular, non-large taxpayers). Office: "Revenue District Office (RDO) - Client Support Section (CSS)".
- "Who may avail: All Business Taxpayers (Head Office) Applying for Closure Not Subject to Audit". Classification: Simple. "Operating Hours 8:00 AM to 5:00 PM".

Client-facing steps (the only steps where the client acts):

| Step | What the client does (CC wording, condensed) | Location / officer | Fee | CC time |
|---|---|---|---|---|
| 1 | "Get a queuing number in the office entrance and wait for your number to be called to submit the required complete documentary requirements at the designated Registration Counter. Note: Secure one queuing number per application." | Registration Officer Counter (Registration Officer, RDO-CSS) | None | 2 hours (client queue/submission) |
| 10 | "Comply with any findings and/or pay tax/es, if applicable." Note: the time to comply "is not part of the total processing time" | Registration Officer Counter | taxes/penalties, if any | not counted |
| 11 | "Buy loose Documentary Stamp (DS)." Registration Officer receives the payment and forwards it to the Revenue Collection Officer, who issues the loose DST | Registration Officer Counter (Registration Officer RDO-CSS; RCO-RDO) | **PHP 30.00 - DS** | 2 min + 3 min |
| 12 | "Receive the TCL1" (Tax Clearance Certificate) | Registration Officer Counter | None | 5 min |

Agency actions in between (so the app can say what happens behind the counter; all "None" fee):
1.2 Registration Officer calls the number and receives the application (5 min). 1.3 Reviews documents and verifies the TIN in eREG TIN Query/ITS/IRIS (30 min). 1.4 Checks completeness: "If documents are complete, stamp received on the application and sign the Checklist of Documentary Requirements (CDR). If incomplete, return the submitted documents and inform the applicant of the lacking requirements by requiring the taxpayer to sign the CDR." (1 hr). 1.5 Assigns a Document Locator Number (10 min). 2.1 Revenue Officer checks the surrendered unused receipts/invoices against the inventory and business notices/permits and endorses to the Committee on Destruction and Disposal (2 hrs). 3.1 "Deregister form type and transmit the application to the office of the Revenue District Officer" (2 hrs). 4.1 Revenue District Officer receives it (1 hr; text about audit screening, see Sec. 8). 5.1 Routing/verification slip (2 hrs). 6.1 Collection Section checks the ledger for unposted payments (3 hrs). 7.1 Compliance Section checks open cases (3 hrs). 8.1 Assessment Section checks if currently subject to audit (3 hrs). 9.1 Registration Officer informs the taxpayer of open cases/liabilities "via email, via call or any other possible means of communication" (45 min). 10.1 "deregister tax types" once no open cases/liabilities or complied (1 hr). 11.3 Generate Tax Clearance Certificate (TCL1) (1 hr). 11.4 Review/sign TCL1 (1 hr). 11.5 "Receive sign TCL and cancel/deregister TIN, if applicable" (20 min). 12.1 Issue TCL1 (5 min).

Arithmetic check (mine, not published): the listed step times add up to about 24 hours = 3 working days of 8 hours, matching "TOTAL PROCESSING TIME: 3 Days".

Deemed-denial rule (quoted, footnote to the table): "If the taxpayer fails to comply with any findings or settle any tax liabilities found within thirty (30) days from receipt of such notification, the application shall be deemed denied. In case the taxpayer complies/settles beyond the 30-day grace period, it will be considered as a new application, hence, the taxpayer needs to resubmit the complete documentary requirements."

Electronic filing alternative (RMC 47-2026 Sec. 3, OCR-verified): the application "shall be submitted to the concerned Revenue District Office (RDO) where the taxpayer's Head or Branch Office is registered, either electronically, by sending the documents using the taxpayer's official email address as duly registered with the BIR, to the RDO's official email address, or through the BIR's electronic registration facilities (i.e. Taxpayer Registration-Related Application (TRRA) Portal, and Online Registration and Update System (ORUS)), or manually, by personally submitting the documents to the concerned RDO. Provided that, documentary requirements, under Items 3 and 4 in Section 4 hereof shall be submitted manually."
- ORUS public home page (no login) lists, under "Update Information": "Closure of Business and Facility / Cancellation of TIN". ORUS FAQ lists "8. Application for Closure of Business" among ORUS transactions. URLs: https://orus.bir.gov.ph/home and https://orus.bir.gov.ph/faqs. I did not log in and did not see the ORUS closure flow, its fees, or its requirements. The Citizen's Charter has NO online (ORUS) closure entry; closure entries 28 to 28-C are walk-in.
- Because items 3 and 4 (unused forms and original COR/permits) must be submitted manually, an ORUS or email filing still needs a trip to the RDO if she has anything to surrender. Whether a taxpayer who holds only an eCOR and no unused forms can finish entirely online is NOT stated.

Confidence: High that the steps are as published; Medium that real RDO practice matches (published times are targets).

---

## 4. Fees and processing time (exactly as published)

| Fact | Exact published text | Source | Date | Confidence |
|---|---|---|---|---|
| Total fee | "TOTAL PROCESSING FEE: PHP 30.00" | CC #28-A (and #28) | 2026 ed. | High |
| What the PHP 30 is | "Payment of P30.00 Loose Stamp/s (DST) to be affixed to the Tax Clearance Certificate issued for closure of business." / "Fee: P30.00 Loose Stamp (DST) to be affixed to the Tax Clearance Certificate issued for closure of business." | CDR F1105C; Form 1905 p. 4 | Jul 2025; Oct 2025 | High |
| RMC 47-2026 on fees | Silent. It does not mention any fee. | RMC 47-2026 | 19 May 2026 | High |
| Processing time (Charter) | "TOTAL PROCESSING TIME: 3 Days" (excludes audit/verification time and the time the taxpayer takes to settle findings) | CC #28-A | 2026 ed. | High |
| Processing time (RMC) | "For micro taxpayers or taxpayers whose gross sales for the immediately preceding year do not exceed Three Million Pesos (P3,000,000.00) or whose gross assets upon retirement do not exceed Eight Million Pesos (P8,000,000.00), the Tax Clearance shall be issued within three (3) working days from the date of submission of the application with complete documentary requirements, if the taxpayer has no open cases or outstanding liabilities, or within (3) working days from the date of submission of the application with complete documentary requirements and payment of any outstanding tax liabilities, including penalties." | RMC 47-2026 Sec. 6 (OCR-verified) | 19 May 2026 | High |
| BIR press statement | "tax clearances may be issued in as fast as three days for qualified cases" | BIR press release 22 Jun 2026: https://bir-cdn.bir.gov.ph/BIR/pdf/PR48JUN2226.pdf | 22 Jun 2026 | High |
| Registration effect | "The registration of the taxpayer shall be cancelled upon mere filing and submission of the complete requirements enumerated under Section 4 hereof ... The taxpayer's registered form types shall be placed under 'deregistered' upon submission of the complete documentary requirements to ensure that no open cases will be generated." Then "the business name registration status of the taxpayer shall be updated to 'Closed' in the BIR registration database." | RMC 47-2026 Sec. 6 | 19 May 2026 | High |
| Annual registration fee (PHP 500) | "The requirement of payment of Annual Registration Fee of Five Hundred Pesos (P500.00) for every separate or distinct establishment or place of business is repealed and shall no longer be applicable effective January 22, 2024." (RR 7-2024, Sec. 5). RMC 91-2024 Q9: "No, under the EOPT Act, the BIR ceased to collect the Annual Registration Fee of Five Hundred Pesos (P500.00) effective January 22, 2024, both for new business registrants and existing business taxpayers." BIR EOPT flyer: "The Annual Registration Fee of P 500 was also removed under the EOPT Act." | RR 7-2024; RMC 91-2024; flyer-eopt.pdf | 2024 | High that it is gone |
| Other money | Any final/short-period taxes and penalties on her returns (amount is case-specific, not published). Optional: PHP 5,000 per taxable year if she uses the one-time abatement (Sec. 5). A notarized SPA costs whatever a notary charges (no official figure) and is needed only if a representative files. | RMC 47-2026; RR 4-2026 | | High (structure), no figure for her taxes |

Stale-text warning: the ORUS FAQ still says "What payment options can I use in paying the P500 Annual Registration Fee and P30 Loose DST?" and "P 500.00 for the Annual Registration Fee" in the new-registration steps. This contradicts RR 7-2024 / RMC 91-2024. Do not use it. Citizen's Charter 28-C also still refers to "no other tax types other than Registration Fee" (leftover wording).

No official deadline to file the closure application was found in RMC 47-2026, RR 7-2024 Sec. 5(J), or RA 11976 Sec. 34 (see Sec. 8 for the conflicting unofficial "10 days / 30 days" claims).

---

## 5. Penalties for unfiled returns before closure

Short answer: **the official sources give rules and general schedules, but NO case-specific amount for her.** The amount depends on which returns are unfiled, which tax types are registered on her COR, tax due, gross receipts per return, and whether she qualifies as micro and for abatement.

### 5.1 What RMC 47-2026 says (OCR-verified)
- Sec. 5: must file "all final or short-period tax returns ... up to the date of closure ... and pay the corresponding taxes due thereon", with "zero returns" for no-activity periods.
- Sec. 6: "Penalties for non-filing of returns shall not accrue after the submission of the required documentary requirements under Section 4 hereof." (So accrual stops at submission; earlier accrued penalties are not waived by this sentence.)
- Sec. 6: the 3-working-day clock covers submission "with complete documentary requirements and payment of any outstanding tax liabilities, including penalties."
- Sec. 7: "Taxpayers who cease business operations without submitting the documentary requirements ... shall continue to be liable for all their tax obligations, including the filing of tax returns and payment of taxes, including penalties, until closure and/or cancellation of business registration is completed with the BIR".
- Citizen's Charter: RDO Collection, Compliance and Assessment sections check for "open cases" and liabilities; the taxpayer is told to "Comply with any findings and/or pay tax/es, if applicable"; 30-day deemed-denial rule (Sec. 3 above). No amounts are given.

### 5.2 General penalty rules on the BIR "Penalties" page (JS-rendered HTML)
URL: https://www.bir.gov.ph/penalties (title "Penalties for Late Filing of Tax Returns"; no date shown). It reproduces:
- Surcharge, NIRC Sec. 248: "a penalty equivalent to twenty-five percent (25%) of the amount due" for failure to file a return and pay the tax on time.
- Interest, NIRC Sec. 249: "interest at the rate of twenty percent (20%) per annum, or such higher rate as may be prescribed" (the page text predates the EOPT changes; see 5.3).
- Compromise penalty for failure to file/pay (Sec. 255), table "From page 5 of Annex A of RMO No. 7-2015", by amount of tax unpaid: up to P5,000 -> P1,000; P5,000-10,000 -> P3,000; P10,000-20,000 -> P5,000; P20,000-50,000 -> P10,000; P50,000-100,000 -> P15,000; P100,000-500,000 -> P20,000; P500,000-1,000,000 -> P30,000; P1,000,000-5,000,000 -> P40,000; above P5,000,000 -> P50,000.
- Compromise penalty for late filing with NO tax due, table "page 4 of Annex A of RMO No. 7-2015", by gross sales/earnings/receipts "based on the subject returns/information for filing/submission": up to P50,000 -> P1,000; P50,000-100,000 -> P3,000; P100,000-500,000 -> P5,000; P500,000-5,000,000 -> P10,000; P5,000,000-10,000,000 -> P15,000; P10,000,000-25,000,000 -> P20,000; above P25,000,000 -> P25,000. (The page's own wording is a mix of Sec. 255 and Sec. 250; whether the figure is per return is not stated on the page.)
- Compromise nature, RMO 7-2015 (22 Jan 2015), https://bir-cdn.bir.gov.ph/BIR/pdf/RMO%20No.%207-2015.pdf: "compromise penalties are only amounts suggested in settlement of criminal liability, and may not therefore be imposed or exacted on the taxpayer". "In no case shall the compromise penalty differ in amount from those specified in the aforementioned Schedule, except when duly approved by the Commissioner or concerned Deputy Commissioner, or in proper cases, by the Regional Directors." (The RMO PDF on the CDN is only the 2-page order; Annex A is not in it. The link on the Penalties page to Annex A (`.../images/bir_files/.../RMO No. 7-2015 Annex A.pdf`) returns HTTP 404.)
- Confidence: High that these are the published general rules and tables; Low that the page is current (it shows pre-EOPT rates); I could not compute a number for her.

### 5.3 EOPT Act concessions for micro and small taxpayers (RA 11976 Sec. 45; BIR flyer)
Quotes (Lawphil text of RA 11976 Sec. 45): "(b) A reduced rate of ten percent (10%) for civil penalties as provided under Section 248 of the NIRC, as amended; (c) A fifty percent (50%) reduction on the interest rate imposed under Section 249 ...; (d) A reduced fine of Five hundred pesos (P500) as penalty for failure to file certain information returns ...; and (e) A reduced compromise penalty rate of at least fifty percent (50%) for violations of Sections 113, 237, and 238 of the NIRC". The BIR flyer repeats these. Note (e) names only Secs. 113, 237, 238 (invoicing), NOT Sec. 255 failure-to-file, so I cannot say the 50% compromise cut applies to unfiled returns (a different BIR PDF I only saw as a search snippet says the 50% applies to Annex A amounts "for micro and small taxpayers": not verified). Micro taxpayer = "gross sales of less than P 3,000,000" (flyer; RR 8-2024).

### 5.4 One-time abatement for micro taxpayers (directly relevant, expires 31 Dec 2026)
- RR No. 4-2026 (face date 18 Jun 2026; BIR press release 22 Jun 2026): https://bir-cdn.bir.gov.ph/BIR/pdf/RR%20No.%204-2026_Redacted.pdf (scanned; OCR-verified). Subject: "Prescribing Guidelines and Procedures for the Availment of a One-Time Abatement of Taxes and/or Penalties for Micro Taxpayers". Covers "open stop-filer cases, including those of micro taxpayers who have ceased business operations" (Sec. 1, 3(c), 5), existing as of 31 Dec 2025. Defines stop-filer case: "a registered taxpayer failed to file and/or submit the required tax return and other tax information within the prescribed due date." Micro = gross sales for the year "less than Three Million Pesos"; "For mixed income earners, 'gross sales' shall only cover business income, excluding compensation income earned under employer-employee relationship". Threshold: "not more than Eighty Thousand Pesos (P80,000.00)" of "total basic tax liabilities and/or penalties ... for a taxable year". Filing: "manually file an application for abatement on a per taxable year basis ... with the Revenue District Office (RDO) having jurisdiction". Fee: "the amount of Five Thousand Pesos (P5,000.00) using BIR Form No. 0605", paid "within five (5) working days from the filing of the application". Period: "until December 31, 2026, unless extended". A Certificate of Availment is issued by the RDO "within five (5) working days from receipt and verification of the proof of payment".
- RMC No. 84-2026 (23 Jul 2026) clarifies RR 4-2026: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2084-2026%20Digest.pdf (digest, clean text) and full text https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2084-2026_Redacted.pdf. Key quotes:
  - Documents for an individual micro taxpayer: BIR Form No. 2121 (3 copies), government ID photocopy, notarized SPA if via representative, "Certificate of Existence of Outstanding Tax Liability/ies" (CEOTL; issued by the RDO for open stop-filer cases, within 2 working days), plus assessment notices if any. Form 2121 is on the BIR Forms page: https://bir-cdn.bir.gov.ph/BIR/pdf/Form%202121.pdf.
  - "All types of penalties-interests, surcharges, open case penalties, compromise penalties under covered under Annex A of Revenue Memorandum Order (RMO) No. 7-2015, as amended ... can be abated". For the P80,000 threshold "unpaid basic taxes and compromise penalties shall be included in the computation while surcharges and interests shall be excluded."
  - "Where the open case liabilities qualify under RR No. 004-2026, and there are no unpaid taxes due, the taxpayer may avail of the One-Time Abatement Program without filing the corresponding unfiled returns."
  - Only obligations due on or before 31 Dec 2025 are covered; "obligations that fell due only in 2026, such as the Annual Income Tax Return for taxable year 2025, are not covered."
  - "The Certificate of Availment may be used to support an application for closure/cancellation of business registration. The processing of the cancellation shall not be held in abeyance by reason of cases already covered by a Certificate of Availment. However, the issuance of a Certificate of Availment shall not automatically trigger the process of closure/cancellation of business registration ... without the proper application for closure/cancellation of business registration under Revenue Memorandum Circular No. 047-2026." Also: "It is not a tax clearance".
  - Classification is "based on the taxpayer's classification reflected in ... IRIS-TRS as of December 31, 2025", verifiable on ORUS "BIR-Registered Business Search and Taxpayer Classification Inquiry" (https://orus.bir.gov.ph/search/businessname) or at the RDO.
  - Applications filed "on or before December 31, 2026 shall be considered timely".
- Confidence: High on the program terms. Eligibility for her specifically (micro status, 2025 cutoffs, per-year P80,000 cap) cannot be decided from the sources.

---

## 6. Requirements from another office (mayor's permit, barangay, DTI)

- **None found in any BIR source.** RMC 47-2026 Sec. 4 says "Only the following documents shall be submitted"; none comes from an LGU, barangay, DTI or SEC. The Citizen's Charter #28/#28-A "WHERE TO SECURE" column lists only the RDO/BIR website and "Taxpayer-applicant" (and, for the representative case, the principal or the corporation's board). Form 1905 and CDR F1105C list none for closure. (Mayor's Permit / DTI Certificate appear on Form 1905 p. 4 only for change of address, change of name/activity, and transfer, not for closure.)
- Related but separate (other agencies; NOT BIR prerequisites; unofficial for BIR purposes): the DTI page "Closing a Business" (https://www.dti.gov.ph/dti-business-center/dti-closing-a-business; no date shown, footer year 2025) says a registered business name must be cancelled separately ("Yes, you must apply for cancellation of your registered business name (BN)") and that LGU procedures differ ("Procedures on closing a business may vary between LGUs"). If she has a DTI business name or a mayor's permit, those are her own separate transactions. The DTI page also carries an outdated BIR description (see Sec. 8).
- Possible confusion to pre-empt: the Citizen's Charter #33 "Delinquency Verification Certificate (DVC)" lists "Closure of Business" among its purposes, but #28/#28-A do NOT list a DVC as a requirement (the RDO checks Collection/Compliance/Assessment internally). #33 is a separate service with "PHP 100.00 Certification Fee and PHP 30.00 loose Documentary Stamp". Do not tell her she needs it.

---

## 7. Accessibility and dates of the official pages

| Document | URL | Format | Machine-readable? | Date / version |
|---|---|---|---|---|
| RMC 47-2026 full text | https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026.pdf | PDF, 3 pp, Canon scan | **No.** Embedded text layer is garbled ("BURf,AUOFIN ER..."). Needs OCR or a hand-verified transcription. Fetch tools that read text return nothing useful. | 19 May 2026; effective immediately |
| RMC 47-2026 digest | https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026%20Digest.pdf | PDF, 3 pp | **Yes**, clean text; matches the full text on every point I checked. A digest, not the controlling text. | 19 May 2026 |
| BIR 2026 RMC list (confirms posting) | https://www.bir.gov.ph/2026-Revenue-Memorandum-Circulars | HTML (JS) | Only in a browser | Lists "RMC No. 47-2026 ... May 19, 2026" with Digest and Full Text links |
| Citizen's Charter 2026 1st Ed. | see Sec. 3 (two PDFs) | PDF ~505 pp | **Yes**, text layer (extractable) | Created 30 Mar 2026 / 23 Apr 2026 |
| CC entry 28-A / 28 (HTML) | https://www.bir.gov.ph/BIRCC-RDO-External-Service-28A (and -28) | HTML via JS | Only in a browser (a plain HTTP fetch returns an empty shell) | 2026 edition; list marks 28-A "(New)", 28 "(With Updates)" |
| Form 1905 | https://bir-cdn.bir.gov.ph/BIR/pdf/1905%20October%202025%20ENCS%20Final.pdf (linked from https://www.bir.gov.ph/bir-forms, 1905 entry) | PDF, 4 pp | Yes | October 2025 (ENCS); file modified 30 Oct 2025 |
| CDR F1105C | https://bir-cdn.bir.gov.ph/BIR/pdf/CDR%20-%202025%20(1).pdf | PDF, 15 pp | Yes | "REVISED JUL2025"; modified 18 Jul 2025 |
| RMC 91-2024 | https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2091-2024.pdf (digest: .../RMC%20No.%2091-2024%20Digest.pdf) | PDF, 9 pp scan | Full text: OCR layer only; digest: text | 14 Aug 2024 |
| RR 7-2024 | https://bir-cdn.bir.gov.ph/BIR/pdf/RR%20No.%207-%202024.pdf (digest: .../RR%207-2024%20(final).pdf, 1 page) | PDF, 17 pp scan | OCR needed | 11 Apr 2024; effective 15 days after publication |
| RR 4-2026 | https://bir-cdn.bir.gov.ph/BIR/pdf/RR%20No.%204-2026_Redacted.pdf | PDF, 4 pp scan | OCR needed | 18 Jun 2026 (face); posted 22 Jun 2026 |
| RMC 84-2026 | digest .../RMC%20No.%2084-2026%20Digest.pdf; full .../RMC%20No.%2084-2026_Redacted.pdf | PDF | Digest: text | 23 Jul 2026 |
| BIR Penalties page | https://www.bir.gov.ph/penalties | HTML via JS | Only in a browser | No date shown; Annex A link is dead (404) |
| EOPT flyer | https://bir-cdn.bir.gov.ph/BIR/pdf/flyer-eopt.pdf | PDF | Yes | 2024 |
| ORUS public pages | https://orus.bir.gov.ph/home, /faqs | JS web app | Only in a browser | n/a |

General note for the app: `bir.gov.ph` pages are a client-rendered Next.js site (server HTML is an empty shell; its content API returned HTTP 403 to a direct request). The reliable, quotable artefacts are the PDFs on `bir-cdn.bir.gov.ph`. For RMC 47-2026, ship a verified transcription (the one in this file is checked against page images) and cite both the full-text PDF and the digest. The BIR homepage "BIR Citizen's Charter" link points to the "(2026 Edition) final.pdf" file.

---

## 8. Conflicts, outdated items, and things not verified

1. **Ending inventory, VAT-only vs everyone.** RMC 47-2026: "for VAT-registered taxpayers". Citizen's Charter 28/28-A, Form 1905 p. 4, CDR F1105C, RMC 91-2024: no VAT qualifier. RMC 47-2026 is later and says "Only the following documents shall be submitted" and repeals inconsistent rules (Sec. 8), so the VAT-only reading should govern. A freelancer under the 3% percentage tax or the 8% option is not VAT-registered. RDO staff may still ask. Confidence: Medium-High.
2. **Audit thresholds.** The Charter (published Mar-Apr 2026, before the RMC) says in #28-A step 4.1 to return the application to CSS "if taxpayer's gross sales/receipts for the immediately preceding year is less than One Million ((P1,000,000.00) or if gross assets upon retirement is less than Three Million ((P3,000,000.00) which will not be subject to audit", and in #28 puts the P1M-P3M sales / P3M-P8M assets band under a "Tax Verification Notice (TVN)" and above P3M / P8M under an "Electronic Letter of Authority (eLA)". RMC 47-2026 (later) says "Micro taxpayers shall not be subject to mandatory audit for closure" and sets the 3-working-day clearance for gross sales up to P3M / gross assets up to P8M, with audit-first only for those with a pending Letter of Authority or above those thresholds. So for a micro freelancer the RMC removes the TVN band. Whether RDOs have updated their practice is unknown. RR 7-2024 Sec. 5(J) and RA 11976 still say cancellation "shall not preclude" an audit.
3. **Edge wording at exactly P3,000,000.** RMC 47-2026 uses "do not exceed P3,000,000"; RA 11976/RR 8-2024/RR 4-2026 define micro as "less than" P3,000,000. Irrelevant unless sales are exactly P3M.
4. **Deadline to apply.** None in RMC 47-2026, RR 7-2024 Sec. 5(J) or RA 11976. The DTI page says to file Form 1905 "within ten (10) days from retirement of business"; unofficial blogs say 30 days (I could not find that in any official text). Treat as "no published deadline found"; penalties for non-filing keep accruing until she submits (RMC Sec. 6-7), so earlier is cheaper.
5. **DTI page lists books of accounts and a letter of request** for BIR closure. This conflicts with RMC 47-2026's closed list. The DTI page is another agency's summary, undated, and older.
6. **ORUS FAQ P500 Annual Registration Fee** is outdated (Sec. 4).
7. **Which Citizen's Charter file is current.** Two near-identical 2026 PDFs ("final" 1 Apr 2026, "v2" 23 Apr 2026). Entry 28-A is word-for-word identical in both. Both predate RMC 47-2026 (19 May 2026) and RR 4-2026. No updated 2026 Charter after May was found.
8. **Lost COR.** The RMC requires the "original" COR "as may be applicable". Form 1905 has a separate replacement route (item 5 "Replacement/Cancellation of ... Certificate of Registration (COR) Lost/Damaged"; page 4: "REPLACEMENT OF LOST COR/ATP 1. Affidavit of Loss. Fee: P30.00 Loose Stamp (DST) for COR only."). No official text says how a lost original COR is handled in a closure. **Not verified.**
9. **eCOR.** No official text says how an electronic COR is "surrendered" or whether she must print it.
10. **Online (ORUS) closure details** (requirements shown, fees, whether items 3 and 4 can be skipped when not applicable): not visible without an ORUS login; I did not log in.
11. **Which tax returns she must file** (e.g. income tax and percentage tax) depends on the tax types printed on her COR. The sources say "all applicable tax types" and do not list forms. **Not verified.**
12. **RMC 47-2026 "replaces" RMC 56-2008 / RMC 57-2020 Annex A11**: stated by a secondary source (see Sec. 9); the RMC text I read says nothing about those; its Sec. 8 repeals only "inconsistent" rules. **Not verified.**
13. **Official Gazette** copy of RA 11976 returned HTTP 403; I relied on Lawphil and BIR's own flyer and RR 7-2024.

---

## 9. Unofficial leads (NOT official; I did not verify their content beyond search-result summaries; do not present as BIR)

- PwC Tax Alert No. 28 on RMC 47-2026: https://www.pwc.com/ph/en/tax/tax-publications/tax-alerts/2026/tax-alert-28.html
- Grant Thornton: https://www.grantthornton.com.ph/insights/articles-and-updates1/tax-notes/bir-prescribes-simplified-guidelines-on-closure-and-cancellation-of-business-registration/ and https://www.grantthornton.com.ph/insights/articles-and-updates1/lets-talk-tax/easing-the-exit-how-rmc-47-2026-transforms-the-old-rules-under-rmc-57-2020/
- CruzMarcelo: https://cruzmarcelo.com/bir-streamlines-business-closure-and-cancellation-procedures-under-revenue-memorandum-circular-no-47-2026/
- SunStar (news): https://www.sunstar.com.ph/cebu/tax-notes-bir-prescribes-simplified-guidelines-on-closure-and-cancellation-of-business-registration
- KPMG: https://kpmg.com/ph/en/insights/2026/05/special-intax-may-2026-issue-1-volume-6.html
- Respicio.ph and Taxify.ph blog posts (freelancer-specific guides; they make claims such as a 30-day deadline, a "PHP 1,000 penalty" and a 30-day processing target that I could not find in any official text): https://www.respicio.ph/commentaries/how-to-properly-close-or-cancel-your-bir-registration-when-shutting-down-a-freelance-business-in-the-philippines , https://taxify.ph/blog/how-to-close-business-bir-philippines/
- Quezon City government guide on LGU closure (barangay clearance / certificate of closure; LGU-specific): https://quezoncity.gov.ph/qcitizen-guides/how-to-close-a-business-in-qc/ (seen only as a search result).

---

## 10. Recommended grounding set for the app (official only)

1. RMC 47-2026 (full text PDF + digest PDF): the rules and the requirement list.
2. Citizen's Charter 2026, entries 28-A (and 28 as the "subject to audit" fallback): client steps, fee, time, where to apply.
3. BIR Form 1905 (Oct 2025) incl. p. 4 checklist: the form and which boxes to tick.
4. RR 7-2024 Sec. 5(J) and RMC 91-2024 Q9 and Q14: legal base and "no annual registration fee".
5. RR 4-2026 + RMC 84-2026 (+ Form 2121): the penalty-relief path for unfiled returns (until 31 Dec 2026).
6. BIR Penalties page + RMO 7-2015: general penalty rules only, flagged as "general schedule, not your amount".

Questions the app must route to "ask the RDO" rather than answer: her exact penalty; whether she is micro for RR 4-2026; filing deadline; lost COR; eCOR handling; ORUS-only completion; which returns apply to her COR; RDO-specific address/hours.
