import { Button } from "@heroui/react";
import { useContext } from "react";
import { counterContext } from "../contexts/counterContext";

export default function Profile() {
 const { counter, setCounter} = useContext(counterContext);
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Profile {counter}</h1>
      <Button onClick={() => setCounter(counter + 1)}>increase</Button>
    </div>
  );
}
