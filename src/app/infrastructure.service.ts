import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Infrastructure } from './infrastructure';
import 'rxjs/add/operator/map';



@Injectable()
export class InfrastructureService {

	private infrastructuresUrl = 'http://localhost/api/customers.php'; 
	private hostgroupsUrl = 'http://localhost/api/hostgroups.php?ip='; 

  constructor(private http: HttpClient) { }

  getInfrastructures(): Observable<Infrastructure[]> {
  	return this.http.get<Infrastructure[]>(this.infrastructuresUrl).map(
  		res => res.map(x => new Infrastructure(x.id, x.name, x.ip, x.port, x.status, x.state, x.description, x.hostgroups))).pipe(
  		catchError(this.handleError('getInfrastructures', [])));
	}

	getInfrastructure(ip, port): Observable<any[]> {
		return this.http.get<any[]>(this.hostgroupsUrl + ip + "&port=" + port).pipe(
  		catchError(this.handleError('getInfrastructure', [])));
	}

	//getInfrastructure(id: number): Observable<Infrastructure> {
		//TO-DO
	  //return of(INFRASTRUCTURES.find(infrastructure => infrastructure.id === id));
	//}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	   
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

}
