import { Layout } from "@/components/shared/layout";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateCategoryDialog } from "@/components/category/create-category-dialog";
import { Card } from "@/components/ui/card";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";

export const Route = createFileRoute("/$slug/_layout/categories")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Categories", content: "Categories" },
      { name: "Categories" },
    ],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Layout
        title="Categories"
        primaryButton={<CreateCategoryDialog slug={slug} />}
      >
        <div className="flex flex-col gap-2">
          {data.organization.categories.map((category) => (
            <Card
              key={category.id}
              className="p-4 border border-input rounded-lg bg-input/30"
            >
              {category.name}
            </Card>
          ))}
        </div>
      </Layout>
    </>
  );
}
