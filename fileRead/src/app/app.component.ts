import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AgGridModule } from 'ag-grid-angular';
import { compileClassMetadata } from '@angular/compiler';

declare var require: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  show = false;
  showHTML = false;
  public userArray: User[] = [];
  public row: String[] = [];
  public userArrayForPRN: User[] = [];
  public arrayForWidths: number[] = [];
  public userArrayDataChunk: String[] = [];
  tableHeaderResponse: any;
  tableBodyResponse: any;
  row_0: any;
  row_prn_0: any;
  all_rows: any;
  row_random: string[] | undefined;

  constructor(private http: HttpClient) {
    this.http.get('assets/Workbook2.csv', { responseType: 'text' })
      .subscribe(
        data => {
          let csvToRowArray = data.split("\n");
          this.row_0 = csvToRowArray[0].split(",");
          for (let index = 1; index < csvToRowArray.length + 1; index++) {
            if (csvToRowArray[index].split(",").length > 6) {
              let sample = csvToRowArray[index].split(",");
              let rowdata = csvToRowArray[index].split(",");
              let mergedname = rowdata[0] + "," + rowdata[1];
              this.row.push(mergedname);
              this.userArray.push(new User(mergedname, sample[2], sample[3], sample[4], sample[5], sample[6]));
            }
          }
          console.log(this.userArray);
        },
        error => {
          console.log(error);
        }
      );

    this.http.get('assets/Workbook2.prn', { responseType: 'text' })
      .subscribe(
        data => {
          let prnToRowArray = data.split("\n")
          // Method called with supplied file data line and the widths of
          // each column as outlined within the file.
          this.arrayForWidths.push(0, 16, 22, 9, 14, 13, 8);

          for (let index = 1; index < this.arrayForWidths.length + 1; index++) {
            this.row_prn_0 = prnToRowArray[0].split(" ");
            let chunkStart = 0, chunkEnd = 0;
            this.userArrayDataChunk.splice(0);
            for (let i = 1; i < this.arrayForWidths.length + 1; i++) {
              chunkStart = chunkEnd;
              chunkEnd = chunkStart + this.arrayForWidths[i];
              let dataChunk = prnToRowArray[index].substring(chunkStart, chunkEnd).trimEnd().trimStart().replace(/[^\x20-\x7E]/g, '');

              this.userArrayDataChunk.push(dataChunk);
            }

            this.userArrayForPRN.push(new User(this.userArrayDataChunk[0], this.userArrayDataChunk[1], this.userArrayDataChunk[2], this.userArrayDataChunk[3], this.userArrayDataChunk[4], this.userArrayDataChunk[5]));

          }
          console.log(this.userArrayForPRN);



        },
        error => {
          console.log(error);
        }
      );
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public ClickDisplay(Event: any) {
    alert("Comparing original JSON responses..");
    let originalCompareResult = JSON.stringify(this.userArray) === JSON.stringify(this.userArrayForPRN);
    alert("Do the original input files match: " + originalCompareResult);
  }
  
  public renderJSON(Event: any, userArray: any) {
    userArray.innerText = JSON.stringify(userArray).replace(/,|}|{|\\/g, "\n");
    alert(userArray);
  }

  public fixedJSON(Event: any, userArray: any) {
    let newUserArray = userArray;
    for (let i = 0; i < userArray.length; i++) {
      let res = newUserArray[i]['creditlimit'] * 100;
      newUserArray[i]['creditlimit'] = Math.round(res).toString().trimStart();
      let dateres = newUserArray[i]['birthday'];
      newUserArray[i]['birthday'] = ((dateres.split("/").reverse().join("/")).replace("/", "")).replace("/", "");
      let nameres = newUserArray[i]['name'];
      newUserArray[i]['name'] = (nameres.replace("\"", "")).replace("\"", "");
      let asciires = newUserArray[i]['address'];
      newUserArray[i]['address'] = asciires.replace(/[^\x20-\x7E]/g, '');
    }
    //console.log(newUserArray);
    let fixedCompareResult = JSON.stringify(newUserArray) === JSON.stringify(this.userArrayForPRN);
    console.log(newUserArray);
    console.log(this.userArrayForPRN);
    alert("Do the original input files match: " + fixedCompareResult);
  }
}


export class User {
  name: String;
  address: String;
  postcode: String;
  phonenumber: String;
  creditlimit: String;
  birthday: String;

  constructor(name: String, address: String, postcode: String, phonenumber: String, creditlimit: String, birthday: String) {
    this.name = name;
    this.address = address;
    this.postcode = postcode;
    this.phonenumber = phonenumber;
    this.creditlimit = creditlimit;
    this.birthday = birthday;
  }
}

