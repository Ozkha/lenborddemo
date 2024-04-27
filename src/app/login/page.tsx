import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login, signup } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm mx-auto h-full my-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Ingresar</CardTitle>
        <CardDescription>
          Escribe el email de ingreso abajo para ingresar a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@ejemplo.com"
              required
            />
          </div>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button formAction={login} className="w-full mt-4">
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
