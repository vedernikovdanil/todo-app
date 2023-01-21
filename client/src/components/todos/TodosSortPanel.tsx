import { InputGroup, Form, Button } from "react-bootstrap";
import { TodosGroupsType } from "./TodosGroups";

function TodosSettings(props: {
  group: TodosGroupsType;
  setGroup: (value: TodosGroupsType) => void;
  showModalAddTodo: () => void;
  className?: string;
}) {
  return (
    <div className={`d-flex gap-2 align-items-center ${props.className || ""}`}>
      <InputGroup>
        <InputGroup.Text>Group by</InputGroup.Text>
        <Form.Select
          value={props.group}
          onChange={(e) => props.setGroup(e.target.value as TodosGroupsType)}
        >
          <option value="updatedAt">No grouping</option>
          <option value="expiresAt">Expiry Date</option>
          <option value="responsible">Responsible</option>
        </Form.Select>
      </InputGroup>
      <Button
        variant="success"
        className="ms-auto text-nowrap"
        onClick={props.showModalAddTodo}
      >
        New Todo <i className="bi bi-plus-lg" />
      </Button>
    </div>
  );
}

export default TodosSettings;
