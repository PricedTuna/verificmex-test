export interface VerificationWebhook {
    data: Data;
    meta: Meta;
}

export interface Data {
    object:              string;
    id:                  string;
    status:              string;
    result:              number;
    errors:              null;
    comments:            null;
    only_mobile_devices: boolean;
    redirect_url:        string;
    webhook:             string;
    validations:         string[];
    document_data:       DocumentData;
    ocr:                 Ocr;
    verifications:       Verifications;
    coincidence:         number;
    optionals:           Optionals;
    form_url:            string;
    created_at:          Date;
    updated_at:          Date;
    readable_created_at: string;
    readable_updated_at: string;
    files:               File[];
}

export interface DocumentData {
    cic:          string;
    curp:         string;
    id_ciudadano: string;
}

export interface File {
    object:     string;
    id:         string;
    file_type:  string;
    mime_type:  string;
    size:       number;
    url:        string;
    created_at: Date;
    updated_at: Date;
}

export interface Ocr {
    ocr_frontal: OcrFrontal;
    ocr_reverso: OcrReverso;
}

export interface OcrFrontal {
    num_emisiones:    string;
    anio_registro:    string;
    clave_elector:    string;
    curp:             string;
    domicilio:        string;
    address:          Address;
    demarcacion:      string;
    fecha_nacimiento: string;
    nombre_completo:  string;
    primer_apellido:  string;
    seccion:          string;
    segundo_apellido: string;
    sexo:             string;
    vigencia:         string;
    codigo_postal:    string;
    nombres:          string;
    anio_emision:     string;
    version_frontal:  string;
}

export interface Address {
    ln1: string;
    ln2: string;
    ln3: string;
}

export interface OcrReverso {
    mrz: string;
}

export interface Optionals {
    id_cliente: string;
}

export interface Verifications {
    fecha_nacimiento_match: boolean;
    sexo_match:             boolean;
    seccion_match:          boolean;
}

export interface Meta {
    include: string;
}
