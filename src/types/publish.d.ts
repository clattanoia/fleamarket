declare namespace Publish {


  interface InImageAuditResult {
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
