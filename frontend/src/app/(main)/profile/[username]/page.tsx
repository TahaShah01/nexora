"use client";

import { Briefcase, Calendar, ClipboardList, Star } from "lucide-react";
import { useParams } from "next/navigation";

import { ProfileAboutCard } from "@/components/profile/profile-about-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProductCard } from "@/components/marketplace/product-card";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { ReviewCard } from "@/components/ui/review-card";
import { PortfolioGallery } from "@/components/profile/portfolio-gallery";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: profileData, isLoading, isError } = useProfile(username);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-56 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </div>
    );
  }

  if (isError || !profileData || !profileData.user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <EmptyState title="Profile not found" description="This user doesn't exist or the link is incorrect." />
      </div>
    );
  }

  const { user: profile, products, services, reviews } = profileData;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <ProfileHeader profile={profile} />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <ProfileAboutCard profile={profile} />

        <Tabs defaultValue="portfolio">
          <TabsList className="w-full flex justify-start overflow-x-auto">
            {profile.portfolioImages && profile.portfolioImages.length > 0 && (
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            )}
            <TabsTrigger value="products">Products ({products?.length || 0})</TabsTrigger>
            <TabsTrigger value="services">Services ({services?.length || 0})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
          </TabsList>

          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <TabsContent value="portfolio">
              <PortfolioGallery images={profile.portfolioImages} />
            </TabsContent>
          )}

          <TabsContent value="products">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No products yet"
                description="Products this seller lists will show up here."
              />
            )}
          </TabsContent>

          <TabsContent value="services">
            {services && services.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No services yet"
                description="Services this provider offers will show up here."
              />
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews && reviews.length > 0 ? (
              <div className="rounded-card border border-border bg-card p-6 flex flex-col">
                {reviews.map((review) => {
                  const author = typeof review.reviewer === "object" ? review.reviewer : null;
                  return (
                    <ReviewCard
                      key={review._id}
                      id={review._id}
                      authorId={author?._id}
                      authorName={author?.name ?? "Nexora user"}
                      authorUsername={author?.username}
                      authorAvatarUrl={author?.avatarUrl}
                      rating={review.rating}
                      comment={review.comment}
                      createdAt={review.createdAt}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="Reviews left for this person as a seller or provider will show up here."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
