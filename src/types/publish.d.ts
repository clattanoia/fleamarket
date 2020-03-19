declare namespace Publish {

  enum AuditImageStatus {
    ERROR = 'error',
    SUCCESS = 'success',
  }

  interface InImageAuditResult {
    auditStatus: AuditImageStatus.ERROR | AuditImageStatus.SUCCESS
    isValid: boolean
    scenes?: string[]
  }

  interface InImageUploadResult {
    qiniuUrl?: string
    auditResult?: InImageAuditResult
  }

  interface InPickerImageFiles extends InImageUploadResult {
    url: string,
    file: {
      path: string
      size: number
    }
  }


}
