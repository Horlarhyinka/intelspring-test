export const formatedResponse = (
  message: string,
  code: number,
  status: string,
  data: any,
) => {
  return {
    message,
    data,
    status,
    code,
  };
};

export const defaultFormattedRes = (
  data: any,
  code: number = 200,
  message: string = 'successful',
  status = 'OK',
) => formatedResponse(message, code, status, data);
