export async function GET(request: Request, res: Response) {
  const users = [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' },
    { name: 'Doe', email: 'doe@example.com' }
  ];
  return Response.json(users);
}
