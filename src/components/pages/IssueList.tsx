import { Issue, issueFactory } from "@/models/Issue";
import { Repository } from "@/models/Repository";
import { User } from "@/models/User";
import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import styles from "../../styles/components/pages/IssueList.module.scss";
import { IssueItem } from "../item/IssueItem";

type IssuePropsType = {
  issues: Issue[];
  user: User;
  repository: Repository;
};

type IssueListType = {
  id: string;
  type: string;
  issues: Issue[];
};

export const IssueList: React.FC<IssuePropsType> = React.memo(
  ({ issues, user, repository }) => {
    const issueTodo = issues.filter(({ type }) => type === "To do");
    const issueDoing = issues.filter(({ type }) => type === "Doing");
    const issueDone = issues.filter(({ type }) => type === "Done");

    const issueList = [
      {
        id: "1",
        type: "To do",
        issues: issueTodo,
      },
      {
        id: "2",
        type: "Doing",
        issues: issueDoing,
      },
      {
        id: "3",
        type: "Done",
        issues: issueDone,
      },
    ];
    const [issueData, setIssueData] = useState(issueList);

    const onDragEnd = async (result: DropResult) => {
      const { source, destination } = result;

      // 別のカラムにタスクが移動した時
      if (source.droppableId !== destination?.droppableId) {
        const newIssueData = JSON.parse(JSON.stringify(issueData));

        const sourceIndex = newIssueData.findIndex(
          (e: IssueListType) => e.id === source.droppableId
        );
        const destinationIndex = newIssueData.findIndex(
          (e: IssueListType) => e.id === destination?.droppableId
        );

        const sourceIssue = [...newIssueData[sourceIndex].issues];
        const destinationIssue = [...newIssueData[destinationIndex].issues];

        // タスクを移動する
        const [removed] = sourceIssue.splice(source.index, 1);
        destinationIssue.splice(destination!.index, 0, removed);

        // typeをupdate
        removed.type = newIssueData[destinationIndex].type;

        newIssueData[sourceIndex].issues = sourceIssue;
        newIssueData[destinationIndex].issues = destinationIssue;
        setIssueData(newIssueData);

        // Make your API call
        await issueFactory().update({
          id: removed.id,
          type: removed.type,
        });
      } else {
        // 同じカラム内でのタスクの入れ替え
        const sourceIndex = issueData.findIndex(
          (e) => e.id === source.droppableId
        );
        const currentSourceIndex = issueData[sourceIndex];
        const sourceIssue = [...currentSourceIndex.issues];
        const [removed] = sourceIssue.splice(source.index, 1);
        sourceIssue.splice(destination.index, 0, removed);
        issueData[sourceIndex].issues = sourceIssue;
        setIssueData(issueData);
      }
    };
    return (
      <div className={styles.issueLayoutContainer}>
        <div className={styles.buttonContainer}>
          <Link href={`/user/${user.id}/repository/${repository.id}/issue/new`}>
            <button className={styles.addIssueButton}>New issue</button>
          </Link>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.issueTypeContainer}>
            {issueData.map((issue) => (
              <Droppable key={issue.id} droppableId={issue.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.issueStateContainer}
                  >
                    <h3 className={styles.issueType}>
                      {issue.type}
                      <span className={styles.issueLength}>
                        {issue.issues.length}
                      </span>
                    </h3>
                    <div className={styles.issueListWrapper}>
                      {issue.issues.map((task, index) => (
                        <Draggable
                          draggableId={String(task.id)}
                          index={index}
                          key={task.id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              className={styles.issueItem}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? "0.5" : "1",
                              }}
                            >
                              <IssueItem task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    );
  }
);
