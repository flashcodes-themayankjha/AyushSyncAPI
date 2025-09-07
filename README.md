# AyushBridge

**AyushBridge** is a lightweight, FHIR R4–compliant terminology micro-service for India’s AYUSH and WHO ICD-11 (TM2 \& Biomedicine) clinical vocabularies. It enables Electronic Medical Record (EMR) systems to integrate, search, and map traditional medicine diagnoses (Ayurveda, Siddha, Unani) using NAMASTE codes, and automatically link them with global ICD-11 codes for true dual-coding, analytics, and interoperability.

***

## Features

- **FHIR R4 compliant resources** for NAMASTE, ICD-11 TM2 \& Biomedicine codes.
- **Auto-complete REST endpoints** for searching AYUSH and ICD-11 codes.
- **Bidirectional mapping** between NAMASTE and ICD-11 (TM2) codes.
- **FHIR Bundle upload endpoint** for dual-coded encounters.
- **OAuth 2.0 and ABHA ID authentication** for secure API access.
- **Audit-ready metadata** for consent and version tracking.
- **Web/CLI demo interface** for term lookup, mapping, and FHIR ProblemList generation.

***

## Why AyushBridge?

- Bridges AYUSH (India’s traditional medicine) and global digital health ecosystems.
- Enables India's healthcare providers and EMRs to code, analyze, and claim insurance for traditional as well as biomedical conditions—using a single, standards-based service.
- Powers analytics, research, and reporting for Ministry of Ayush, insurance, and public health.

***

## System Workflow

1. **Code Ingestion**
Parse the NAMASTE CSV and ingest the AYUSH code system. Fetch ICD-11 TM2 and Biomedicine codes via the WHO API and synchronize the mappings.
2. **Auto-complete and Translation**
Use the REST API endpoints to search, look up, and translate between AYUSH (NAMASTE) and ICD-11 codes.
3. **FHIR Bundle Upload**
Securely upload dual-coded clinical encounters for record-keeping and analytics, following EHR 2016 standards.
4. **Web/CLI Demo Interface**
Test and demonstrate code search, mapping, and ProblemList entry creation.

***

## API Endpoints

- `GET /codes/search?query=<term>&type=namaste|icd` – Search and auto-complete codes
- `POST /codes/translate` – Map between NAMASTE and TM2 codes
- `POST /fhir/bundle/upload` – Securely upload FHIR Bundles (dual-coded)
- OAuth 2.0 endpoints for ABHA authentication

***

## Compliance

- **Meets India’s 2016 EHR standards** (FHIR R4, ISO 22600, SNOMED CT, LOINC)
- **Consent and version tracking** within all core data operations

***

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
*(Python/Node/Java, depending on your backend framework)*
3. **Configure OAuth 2.0 and ABHA endpoints**
4. **Run the migration to ingest NAMASTE and ICD-11 code data**
5. **Start the API service**
6. **Access API docs and sample CLI/Web interface for demo**

***

## License

Released under the [MIT](https://opensource.org/license/mit) License.

***

## Contributors

- Ministry of Ayush, Government of India
- Open-source digital health community

***

## Acknowledgements

- [NAMASTE Portal, Ministry of AYUSH](https://namaste.ayush.gov.in)
- [WHO ICD-11 API](https://icd.who.int/icdapi)

***

For more information, technical questions, or contribution guidelines, please refer to the `/docs` directory or raise an issue in this repository.

<div style="text-align: center">⁂</div>

[^1]: 25026.pdf

