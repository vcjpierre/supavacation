import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  //Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  //retrieve all the favorite home for user
  if (req.method === 'GET') {
    const favorite = await prisma.home.findMany({
      where: {
        ownerFavoriteHome: {
          some: { email: session.user.email }
        }
      },
    });

    res.status(200).json(favorite)
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}