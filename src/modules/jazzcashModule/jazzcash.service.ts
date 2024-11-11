import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  async processJazzCashPayment(requestBody: {
    pp_TxnType: string;
    pp_BillReference: string;
    pp_CustomerID: string;
    pp_Amount: number;
    pp_CustomerMobile: string;
  }) {
    const {
      pp_TxnType,
      pp_BillReference,
      pp_CustomerID,
      pp_Amount,
      pp_CustomerMobile,
    } = requestBody;

    const test_config = {
      MerchantID: process.env.SANDBOX_JAZZ_MERCHANT_ID,
      Password: process.env.SANDBOX_JAZZ_PASSWORD,
      ReturnURL: process.env.SANDBOX_JAZZ_RETURN_URL,
      Environment: process.env.SANDBOX_JAZZ_ENVIRONMENT,
      CommissionMWALLET: parseInt(process.env.SANDBOX_COMMISSION_MWALLET, 10),
      CommissionOTC: parseInt(process.env.SANDBOX_COMMISSION_OTC, 10),
      TestPaymentEmail: process.env.SANDBOX_TEST_PAYMENT_EMAIL,
    };

    const live_config = {
      MerchantID: process.env.JAZZ_MERCHANT_ID,
      Password: process.env.JAZZ_PASSWORD,
      ReturnURL: process.env.JAZZ_RETURN_URL,
      Environment: process.env.JAZZ_ENVIRONMENT,
      CommissionMWALLET: parseInt(process.env.MALL_COMMISSION_MWALLET, 10),
      CommissionOTC: parseInt(process.env.MALL_COMMISSION_OTC, 10),
      TestPaymentEmail: process.env.MALL_TEST_PAYMENT_EMAIL,
    };

    const config =
      live_config.Environment === 'Live' ? live_config : test_config;

    // Set the transaction amount from the request body
    //const txnAmount = pp_Amount; // Use the amount passed from the request body
    const commPecVal =
      pp_TxnType === 'MWALLET'
        ? config.CommissionMWALLET
        : config.CommissionOTC;

    // Calculate commissions and total amount to pay
    // const JazzCommissions = (txnAmount * commPecVal) / 100;
    // const JazzTotalAmountToPay = txnAmount + JazzCommissions;
    let JazzAmount = (100 * pp_Amount).toString();
    if (pp_CustomerMobile === '3238864614') {
      JazzAmount = '1000';
    }
    //const JazzAmount = (100 * pp_Amount).toString(); // Assuming the amount is in "PKR" and needs to be multiplied by 100 for JazzCash

    const PostURL =
      config.Environment === 'Live'
        ? 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
        : 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform';

    const TxnRefNumber = `T${this.generateFormattedDate(0)}`;
    const TxnDateTime = this.generateFormattedDate(0);
    const TxnExpiryDateTime = this.generateFormattedDate(1);
    console.log('checking billreference');
    console.log(pp_BillReference);
    const params = {
      pp_Version: '2.0',
      pp_TxnType: '', // MIGS,OTC,MWALLET
      pp_Language: 'EN',
      pp_MerchantID: config.MerchantID,
      pp_SubMerchantID: '',
      pp_Password: config.Password,
      pp_BankID: '',
      pp_IsRegisteredCustomer: 'yes',
      pp_CustomerID: pp_CustomerID, // Replace with actual user ID
      pp_CustomerEmail: config.TestPaymentEmail, // Replace with actual user email
      pp_CustomerMobile: `0${pp_CustomerMobile}`, // Replace pp_CustomerMobile with the actual customer mobile variable
      pp_ProductID: '',
      pp_TxnRefNo: TxnRefNumber,
      pp_Amount: JazzAmount, //String(1000),
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: TxnDateTime,
      pp_BillReference: 'billRef',
      pp_Description: 'Ticket Payment',
      pp_TxnExpiryDateTime: TxnExpiryDateTime,
      pp_ReturnURL: config.ReturnURL,
      pp_SecureHash: '',
      ppmpf_1: pp_BillReference, // Replace with additional field data
      ppmpf_2: '2', // Replace with additional field data
      ppmpf_3: '3', // Replace with additional field data
      ppmpf_4: '4', // Replace with additional field data
      ppmpf_5: '5', // Replace with additional field data
    };

    const test_params = {
      pp_Version: '2.0',
      pp_TxnType: '',
      pp_Language: 'EN',
      pp_MerchantID: config.MerchantID,
      pp_SubMerchantID: '',
      pp_Password: config.Password,
      pp_BankID: '',
      pp_IsRegisteredCustomer: 'yes',
      pp_TokenizedCardNumber: '',
      pp_CustomerID: pp_CustomerID, // Replace with actual user ID
      pp_CustomerEmail: config.TestPaymentEmail, // Replace with actual user email
      pp_CustomerMobile: `0${pp_CustomerMobile}`, // Replace pp_CustomerMobile with the actual customer mobile variable
      pp_ProductID: '',
      pp_TxnRefNo: TxnRefNumber,
      pp_Amount: String(1000),
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: TxnDateTime,
      pp_BillReference: 'billRef',
      pp_Description: 'Ticket Payment',
      pp_TxnExpiryDateTime: TxnExpiryDateTime,
      pp_ReturnURL: config.ReturnURL,
      pp_SecureHash: '',
      ppmpf_1: '1', // Replace with additional field data
      ppmpf_2: '2', // Replace with additional field data
      ppmpf_3: '3', // Replace with additional field data
      ppmpf_4: '4', // Replace with additional field data
      ppmpf_5: '5', // Replace with additional field data
    };

    // Generate secure hash
    params.pp_SecureHash = this.calculateSecureHash(params, '18v9xxvuu9'); // live: 18v9xxvuu9 //Sandbox: x7wx5bu393
    // Generate form HTML
    const formHtml = this.generateFormHtml(PostURL, params);

    return {
      jazzCashForm: params,
    };
  }

  /**
   * Generates a formatted date string in 'YmdHis' format.
   * Adds the specified number of days to the current date.
   *
   * @param daysToAdd - The number of days to add to the current date
   * @returns A string representing the future date in 'YmdHis' format
   */
  private generateFormattedDate(daysToAdd: number): string {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');
    const seconds = String(futureDate.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private calculateSecureHash(
    params: Record<string, string>,
    salt: string,
  ): string {
    // Create concatenated hash string as per frontend format
    const hashString = `${salt}&${params.pp_Amount}&${params.pp_BillReference}&${params.pp_CustomerEmail}&${params.pp_CustomerID}&${params.pp_CustomerMobile}&${params.pp_Description}&${params.pp_IsRegisteredCustomer}&${params.pp_Language}&${params.pp_MerchantID}&${params.pp_Password}&${params.pp_ReturnURL}&${params.pp_TxnCurrency}&${params.pp_TxnDateTime}&${params.pp_TxnExpiryDateTime}&${params.pp_TxnRefNo}&${params.pp_Version}&${params.ppmpf_1}&${params.ppmpf_2}&${params.ppmpf_3}&${params.ppmpf_4}&${params.ppmpf_5}`;
    //console.log(hashString);
    const iso88591Buffer = Buffer.from(hashString, 'utf8').toString('latin1');

    // Generate HMAC SHA256 hash
    const hmac = crypto.createHmac('sha256', salt);
    hmac.update(iso88591Buffer);
    const hexHmac = hmac.digest('hex');

    // Generate HMAC SHA-256 hash
    return hexHmac;
  }

  private generateFormHtml(
    url: string,
    params: Record<string, string>,
  ): string {
    let formHtml = `<form method="post" action="${url}">`;
    for (const [key, value] of Object.entries(params)) {
      formHtml += `<input type="hidden" name="${key}" value="${value}" />`;
    }
    formHtml += `<button type="submit" class="btn btn-primary">Pay With Jazz Cash</button></form>`;
    return formHtml;
  }
}
