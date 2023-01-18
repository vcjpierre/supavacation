import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  //Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  //Retrieve home ID from request
  const { id } = req.query;
  const home = await prisma.home.findUnique({ where: { id } })

  if (!home) return res.status(500).json({ message: 'Home no found.' });

  //Add home to favorite
  if (req.method === 'PUT') {

    const favorite = await prisma.home.update({
      where: { id: home.id },
      data: {
        ownerFavoriteHome: {
          connect: { email: session.user.email }
        }
      }
    });

    res.status(200).json(favorite)
  }
  //Remove home from favorite
  else if (req.method === 'DELETE') {

    const favorite = await prisma.home.update({
      where: { id: home.id },
      data: {
        ownerFavoriteHome: {
          disconnect: { email: session.user.email }
        }
      }
    });

    res.status(200).json(favorite)
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}