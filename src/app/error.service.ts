import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
 
  errorMessage: string = "";
  errorCode: string = "";

  constructor() { }
}