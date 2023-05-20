import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import styles from "../../styles/components/pages/Issue.module.scss";
import { IssueItem } from "../item/IssueItem";
import { IssueStateType } from "./RepositoryDetail";

type IssuePropsType = {
  issues: IssueStateType[];
};

export const Issue: React.FC<IssuePropsType> = React.memo(({ issues }) => {
  const [issueData, setIssueData] = useState(issues);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // 別のカラムにタスクが移動した時
    if (source.droppableId !== destination?.droppableId) {
      const sourceIndex = issueData.findIndex(
        (e) => e.id === source.droppableId
      );
      const destinationIndex = issueData.findIndex(
        (e) => e.id === destination?.droppableId
      );
      const currentSourceIndex = issueData[sourceIndex];
      const currentDestinationIndex = issueData[destinationIndex];
      const sourceIssue = [...currentSourceIndex.issues];
      const destinationIssue = [...currentDestinationIndex.issues];
      const [removed] = sourceIssue.splice(source.index, 1);
      destinationIssue.splice(destination!.index, 0, removed);
      issueData[sourceIndex].issues = sourceIssue;
      issueData[destinationIndex].issues = destinationIssue;
      setIssueData(issueData);
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
        <Link href={"/motoki/fithub/issue/new"}>
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
                        draggableId={task.id}
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
});
