export interface UserQuery {
  trackingCode: string,
  firstName: string,
  lastName: string,
  nationalCode: string,
  mobileNumber: string,
}

export interface UserQueryResponse {
  companyName: string,
  trackingCode: string,
  firstName: string,
  lastName: string,
  nationalCode: string,
  mobileNumber: string,
  currentStep: Step,
  "isCompleted": true
}

export enum Step {
  SHAHKAR= "SHAHKAR",
  VIDEO = "VIDEO",
  SIGN = "SIGN",

}
