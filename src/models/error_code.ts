export interface ErrorCode {

  ID: number
  Code: string
  Model: string
  Unit: string
  Title: string
  Contents: string
  Detail: string
  Recovery: string
  Comment: string
  Count: number
  Date: string
  MAP1: string
  MAP2: string
  MAP3: string
  MAP4: string
  MAP5: string
  MAP6: string
  MAP7: string
  MAP8: string
  MAP9: string
  MAP10: string
  MAP11: string
  MAP12: string
  MAP13: string
  MAP14: string
  MAP15: string
  MAP16: string
  MAP17: string
  MAP18: string
  MAP19: string
  MAP20: string

}

export interface ErrorResponse {
  success: boolean
  data: {
    error: ErrorCode[]
  }
}
