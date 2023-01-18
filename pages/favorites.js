import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Get all favorites homes from the authenticated user
  const homes = await prisma.home.findMany({
    where: {
      ownerFavoriteHome: {
        some: { email: session.user.email }
      }
    },
    include: {
      ownerFavoriteHome: true
    }
  });

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your Favorites homes</h1>
      <p className="text-gray-500">
        Manage your favorites homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Favorites;