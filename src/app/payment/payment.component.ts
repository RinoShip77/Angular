import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { DataService } from '../data.service';
import { ElectrolibService } from '../electrolib.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import {PaymentService} from '../payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @ViewChild('paymentRef', {static:true}) paymentRef!: ElementRef;

  @ViewChild('confirmModal', {static:true}) templateRef: TemplateRef<any> | undefined;

  user: User | undefined = new User();
  amount = 0;

  theme = "";

  /*test
  fill with random
  Card number: 4214021321938524
  Expiry date: 06/2027
  CVC code: 701
  */

  constructor(private router: Router, private datasrv: DataService, private electrolibService: ElectrolibService,  private modalService: NgbModal)
  {

  }
  
  ngOnInit(): void {

      if(localStorage.getItem('theme') != "light")
      {
        this.theme = "dark";
      }
      else
      {
        this.theme = "";
      }

      this.user = this.datasrv.getUser();

      window.paypal.Buttons(
        {
          style: 
          {
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: "paypal",
          },

          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.user?.fees.toString(),
                    currency_code: 'CAD'
                  }
                }
              ]
            })
          },
          onApprove: (date:any, actions:any) => 
          {
            return actions.order.capture().then((details:any) => 
            {
              if(details.status === 'COMPLETED') 
              {
                this.paymentConfirmed();
              }
            })
          },
          onError: (error:any) => 
          {
            this.paymentRefused();
          }
        }
      ).render(this.paymentRef.nativeElement);
  }

  async paymentConfirmed()
  {
    if(this.user)
    {
      await this.electrolibService.payFees(this.user.idUser).subscribe();
      this.modalService.dismissAll();
    }

    await this.reloadUser();

    this.router.navigate(['borrows']);
    this.openConfirmModal();
  }

  paymentRefused()
  {
    console.log("Erreur de paiement");
  }

  reloadUser()
  {
    if(this.user)
    {
      this.electrolibService.connection(this.user).subscribe(
        connectedUser => 
        {
          
          if(this.user)
          {
            
            this.user = connectedUser;
            this.datasrv.updateUser(this.user);
          }
        }
      )
    }
  }

  openConfirmModal()
  {
    this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title', size: 'lg', animation:true, });
  }
}
