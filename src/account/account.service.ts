import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { defaultFormattedRes } from 'src/utils/helpers';

@Injectable()
export class AccountService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  }

  // ✅ Resolve a bank account number to get account name
  async resolveAccount(accountNumber: string, bankCode: string) {
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.paystackBaseUrl}/bank/resolve`,
        {
          headers: this.getHeaders(),
          params: {
            account_number: accountNumber,
            bank_code: bankCode,
          },
        },
      );

      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error(response.data.message ?? 'Unable to resolve account');
      }
    } catch (error) {
      throw new Error(
        `Account validation failed: ${error?.response?.data?.message || error.message}`,
      );
    }
  }

  async getBankDetails(code: string) {
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.paystackBaseUrl}/bank`,
        {
          headers: this.getHeaders(),
        },
      );
      const allBanks = response.data?.data;
      const target = allBanks?.find((b) => b.code === code);
      if (target) return { code: target?.code, name: target?.name };
      return null;
    } catch (err) {
      throw Error(err?.response?.data ?? 'Failed to get bank details');
    }
  }

  // ✅ Get all supported banks and their codes
  async getBankCodes() {
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.paystackBaseUrl}/bank`,
        {
          headers: this.getHeaders(),
        },
      );

      if (response.data.status) {
        const d = response.data.data.map((bank: any) => ({
          name: bank.name,
          code: bank.code,
        }));
        return defaultFormattedRes(d, 200);
      } else {
        return new HttpException(
          response.data.message ?? 'Unable to fetch banks',
          500,
        );
      }
    } catch (error) {
      return new HttpException(
        `Failed to get banks: ${error?.response?.data?.message || error.message}`,
        500,
      );
    }
  }
}
