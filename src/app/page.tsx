import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary">JanRich Frontend</h1>
        </header>

        <main className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-blue-600">
              Welcome to JanRich
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              A modern frontend application with Tailwind CSS and shadcn/ui
              components.
            </p>
          </div>

          {/* Test Basic Tailwind Classes */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Tailwind Test</h3>
            <div className="flex flex-wrap gap-4">
              <div className="bg-red-500 text-white p-4 rounded">Red Box</div>
              <div className="bg-blue-500 text-white p-4 rounded">Blue Box</div>
              <div className="bg-green-500 text-white p-4 rounded">
                Green Box
              </div>
            </div>
          </div>

          {/* Button Examples */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Button Components</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Card Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>Theme-aware primary colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-primary rounded"></div>
                  <div className="h-4 bg-primary/80 rounded"></div>
                  <div className="h-4 bg-primary/60 rounded"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secondary Colors</CardTitle>
                <CardDescription>Theme-aware secondary colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-secondary rounded"></div>
                  <div className="h-4 bg-secondary/80 rounded"></div>
                  <div className="h-4 bg-secondary/60 rounded"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Muted Colors</CardTitle>
                <CardDescription>Theme-aware muted colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted/80 rounded"></div>
                  <div className="h-4 bg-muted/60 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
