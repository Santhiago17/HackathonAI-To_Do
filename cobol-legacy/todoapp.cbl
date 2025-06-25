       IDENTIFICATION DIVISION.
       PROGRAM-ID. todoapp.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
      *--- General ---
       01 MENU-OPTION         PIC 9.
       01 EXIT-FLAG           PIC X VALUE 'N'.
       01 IDX                 PIC 9(4).
       01 JDX                 PIC 9(4).
       01 WS-DUMMY            PIC X(100).
       01 WS-INPUT            PIC X(100).
       01 WS-FOUND            PIC X VALUE 'N'.
       01 WS-USER-ID          PIC 9(4).
       01 WS-TASK-ID          PIC 9(4).

      * --- User Entity ---
       01 USER-COUNT            PIC 9(4) VALUE 0.
       01 USER-ID               PIC 9(4).
       01 USER-FIRST-NAME       PIC X(30).
       01 USER-LAST-NAME        PIC X(100).
       01 USER-BIRTH-DATE       PIC 9(8).
       01 USER-AGE              PIC 99.
       01 USERS-TABLE.
           05 USERS-ENTRY OCCURS 100 TIMES.
               10 USERS-ID         PIC 9(4).
               10 USERS-FIRST-NAME PIC X(30).
               10 USERS-LAST-NAME  PIC X(100).
               10 USERS-BIRTH-DATE PIC 9(8).

      * --- Task Entity ---
       01 TASK-COUNT               PIC 9(4) VALUE 0.
       01 TASK-ID                  PIC 9(4).
       01 TASK-TITLE               PIC X(100).
       01 TASK-DESCRIPTION         PIC X(1000).
       01 TASK-END-DATE            PIC 9(8).
       01 TASK-CREATOR-ID          PIC 9(4).
       01 TASK-ASSIGNEE-ID         PIC 9(4).
       01 TASK-TAGS                PIC X(100).
       01 TASK-PRIORITY            PIC 9(1).
       01 TASK-STATUS              PIC X(10).
       01 TASK-CREATION-DT         PIC 9(14).
       01 TASK-UPDATE-DT           PIC 9(14).
       01 TASKS-TABLE.
           05 TASKS-ENTRY OCCURS 500 TIMES.
               10 TASKS-ID            PIC 9(4).
               10 TASKS-TITLE         PIC X(100).
               10 TASKS-DESCRIPTION   PIC X(1000).
               10 TASKS-END-DATE      PIC 9(8).
               10 TASKS-CREATOR-ID    PIC 9(4).
               10 TASKS-ASSIGNEE-ID   PIC 9(4).
               10 TASKS-TAGS          PIC X(100).
               10 TASKS-PRIORITY      PIC 9(1).
               10 TASKS-STATUS        PIC X(10).
               10 TASKS-CREATION-DT   PIC 9(14).
               10 TASKS-UPDATE-DT     PIC 9(14).

      * --- Date/Time Utility ---
       01 WS-CURRENT-DATE     PIC 9(8).
       01 WS-CURRENT-DATETIME PIC 9(14).
       01 WS-FUNCTION-DATE    PIC X(21).
       01 WS-AGE              PIC 99.
       01 WS-BIRTH-YEAR       PIC 9(4).
       01 WS-BIRTH-MONTH      PIC 99.
       01 WS-BIRTH-DAY        PIC 99.
       01 WS-CURR-YEAR        PIC 9(4).
       01 WS-CURR-MONTH       PIC 99.
       01 WS-CURR-DAY         PIC 99.

       PROCEDURE DIVISION.
       MAIN-LOOP.
           PERFORM UNTIL EXIT-FLAG = 'Y'
               DISPLAY "\nTODO Application Menu"
               DISPLAY "1. Create user"
               DISPLAY "2. List users"
               DISPLAY "3. Create task"
               DISPLAY "4. Edit task"
               DISPLAY "5. List all tasks"
               DISPLAY "6. List tasks assigned to a user"
               DISPLAY "7. Search tasks by tag"
               DISPLAY "8. Remove task"
               DISPLAY "9. Update task status"
               DISPLAY "0. Exit"
               ACCEPT MENU-OPTION
               EVALUATE MENU-OPTION
                   WHEN 1 PERFORM CREATE-USER
                   WHEN 2 PERFORM LIST-USERS
                   WHEN 3 PERFORM CREATE-TASK
                   WHEN 4 PERFORM EDIT-TASK
                   WHEN 5 PERFORM LIST-TASKS
                   WHEN 6 PERFORM LIST-TASKS-BY-USER
                   WHEN 7 PERFORM SEARCH-TASKS-BY-TAG
                   WHEN 8 PERFORM REMOVE-TASK
                   WHEN 9 PERFORM UPDATE-TASK-STATUS
                   WHEN 0 MOVE 'Y' TO EXIT-FLAG
                   WHEN OTHER DISPLAY "Invalid option. Try again."
               END-EVALUATE
           END-PERFORM
           STOP RUN.

      * --- User Management ---
       CREATE-USER.
           DISPLAY "[Create User]"
           DISPLAY "Enter first name (max 30 chars):"
           ACCEPT USER-FIRST-NAME
           IF FUNCTION LENGTH(USER-FIRST-NAME) > 30
               DISPLAY "First name too long." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter last name (max 100 chars):"
           ACCEPT USER-LAST-NAME
           IF FUNCTION LENGTH(USER-LAST-NAME) > 100
               DISPLAY "Last name too long." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter birth date (YYYYMMDD):"
           ACCEPT USER-BIRTH-DATE
           PERFORM CALCULATE-AGE
           IF USER-AGE < 18
               DISPLAY "User must be at least 18 years old." 
      -         EXIT PARAGRAPH
           END-IF
           ADD 1 TO USER-COUNT
           MOVE USER-COUNT TO USER-ID
           MOVE USER-FIRST-NAME TO USERS-FIRST-NAME(USER-COUNT)
           MOVE USER-LAST-NAME TO USERS-LAST-NAME(USER-COUNT)
           MOVE USER-BIRTH-DATE TO USERS-BIRTH-DATE(USER-COUNT)
           DISPLAY "User created successfully! ID: " USER-ID
           .

       LIST-USERS.
           DISPLAY "\n--- Users List ---"
           IF USER-COUNT = 0
               DISPLAY "No users registered."
           ELSE
               PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > USER-COUNT
                   DISPLAY "ID: " USERS-ID(IDX) ",
      -            " Name: " USERS-FIRST-NAME(IDX) " "
      -            USERS-LAST-NAME(IDX)
      -            " Birth: " USERS-BIRTH-DATE(IDX)
               END-PERFORM
           END-IF
           .

      * --- Task Management ---
       CREATE-TASK.
           DISPLAY "[Create Task]"
           DISPLAY "Enter title (max 100 chars):"
           ACCEPT TASK-TITLE
           IF FUNCTION LENGTH(TASK-TITLE) > 100
               DISPLAY "Title too long." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter description (max 1000 chars):"
           ACCEPT TASK-DESCRIPTION
           IF FUNCTION LENGTH(TASK-DESCRIPTION) > 1000
               DISPLAY "Description too long." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter end date (YYYYMMDD):"
           ACCEPT TASK-END-DATE
           PERFORM VALIDATE-TASK-END-DATE
           IF WS-DUMMY = 'N'
               DISPLAY "End date cannot be in the past." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter creator user ID:"
           ACCEPT TASK-CREATOR-ID
           DISPLAY "Enter assignee user ID:"
           ACCEPT TASK-ASSIGNEE-ID
           IF TASK-ASSIGNEE-ID = ZERO
               DISPLAY "Task must be assigned to a user." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter tags (comma separated, max 100 chars):"
           ACCEPT TASK-TAGS
           IF FUNCTION LENGTH(TASK-TAGS) > 100
               DISPLAY "Tags too long." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter priority (1=Low, 2=Medium, 3=High):"
           ACCEPT TASK-PRIORITY
           IF TASK-PRIORITY < 1 OR TASK-PRIORITY > 3
               DISPLAY "Invalid priority." EXIT PARAGRAPH
           END-IF
           DISPLAY "Enter status (e.g. TODO, DOING, DONE):"
           ACCEPT TASK-STATUS
           PERFORM SET-TASK-DATES
           ADD 1 TO TASK-COUNT
           MOVE TASK-COUNT TO TASK-ID
           MOVE TASK-TITLE TO TASKS-TITLE(TASK-COUNT)
           MOVE TASK-DESCRIPTION TO TASKS-DESCRIPTION(TASK-COUNT)
           MOVE TASK-END-DATE TO TASKS-END-DATE(TASK-COUNT)
           MOVE TASK-CREATOR-ID TO TASKS-CREATOR-ID(TASK-COUNT)
           MOVE TASK-ASSIGNEE-ID TO TASKS-ASSIGNEE-ID(TASK-COUNT)
           MOVE TASK-TAGS TO TASKS-TAGS(TASK-COUNT)
           MOVE TASK-PRIORITY TO TASKS-PRIORITY(TASK-COUNT)
           MOVE TASK-STATUS TO TASKS-STATUS(TASK-COUNT)
           MOVE TASK-CREATION-DT TO TASKS-CREATION-DT(TASK-COUNT)
           MOVE TASK-UPDATE-DT TO TASKS-UPDATE-DT(TASK-COUNT)
           DISPLAY "Task created successfully! ID: " TASK-ID
           .

       LIST-TASKS.
           DISPLAY "\n--- Tasks List ---"
           IF TASK-COUNT = 0
               DISPLAY "No tasks registered."
           ELSE
               PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
                   DISPLAY "ID: " TASKS-ID(IDX) ", 
      -            " Title: " TASKS-TITLE(IDX) ",
      -            " Assignee: " TASKS-ASSIGNEE-ID(IDX) ",
      -            " End: " TASKS-END-DATE(IDX) ",
      -            " Tags: " TASKS-TAGS(IDX) ",
      -            " Priority: " TASKS-PRIORITY(IDX) ",
      -            " Status: " TASKS-STATUS(IDX)
               END-PERFORM
           END-IF
           .

       LIST-TASKS-BY-USER.
           DISPLAY "Enter user ID to list tasks:"
           ACCEPT WS-USER-ID
           MOVE 'N' TO WS-FOUND
           PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
               IF TASKS-ASSIGNEE-ID(IDX) = WS-USER-ID
                   DISPLAY "ID: " TASKS-ID(IDX) ",
      -            " Title: " TASKS-TITLE(IDX) ",
      -            " Status: " TASKS-STATUS(IDX)
                   MOVE 'Y' TO WS-FOUND
               END-IF
           END-PERFORM
           IF WS-FOUND = 'N'
               DISPLAY "No tasks found for this user."
           END-IF
           .

       SEARCH-TASKS-BY-TAG.
           DISPLAY "Enter tag to search:"
           ACCEPT WS-INPUT
           MOVE 'N' TO WS-FOUND
           PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
               IF TASKS-TAGS(IDX) = WS-INPUT
                   DISPLAY "ID: " TASKS-ID(IDX) 
      -            ", Title: " TASKS-TITLE(IDX) 
      -            ", Tags: " TASKS-TAGS(IDX)
      
                   MOVE 'Y' TO WS-FOUND
               END-IF
           END-PERFORM
           IF WS-FOUND = 'N'
               DISPLAY "No tasks found with this tag."
           END-IF
           .

       REMOVE-TASK.
           DISPLAY "Enter task ID to remove:"
           ACCEPT WS-TASK-ID
           MOVE 'N' TO WS-FOUND
           PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
               IF TASKS-ID(IDX) = WS-TASK-ID
                   PERFORM REMOVE-TASK-AT-IDX
                   DISPLAY "Task removed."
                   MOVE 'Y' TO WS-FOUND
                   EXIT PERFORM
               END-IF
           END-PERFORM
           IF WS-FOUND = 'N'
               DISPLAY "Task not found."
           END-IF
           .

       REMOVE-TASK-AT-IDX.
           PERFORM VARYING JDX FROM IDX BY 1 UNTIL JDX >= TASK-COUNT
               MOVE TASKS-ENTRY(JDX + 1) TO TASKS-ENTRY(JDX)
           END-PERFORM
           SUBTRACT 1 FROM TASK-COUNT
           .

       UPDATE-TASK-STATUS.
           DISPLAY "Enter task ID to update status:"
           ACCEPT WS-TASK-ID
           MOVE 'N' TO WS-FOUND
           PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
               IF TASKS-ID(IDX) = WS-TASK-ID
                   DISPLAY "Current status: " TASKS-STATUS(IDX)
                   DISPLAY "Enter new status (TODO/DOING/DONE):"
                   ACCEPT WS-INPUT
                   MOVE WS-INPUT TO TASKS-STATUS(IDX)
                   PERFORM GET-CURRENT-DATETIME
                   MOVE WS-CURRENT-DATETIME TO TASKS-UPDATE-DT(IDX)
                   DISPLAY "Status updated."
                   MOVE 'Y' TO WS-FOUND
                   EXIT PERFORM
               END-IF
           END-PERFORM
           IF WS-FOUND = 'N'
               DISPLAY "Task not found."
           END-IF
           .

       EDIT-TASK.
           DISPLAY "Enter task ID to edit:"
           ACCEPT WS-TASK-ID
           MOVE 'N' TO WS-FOUND
           PERFORM VARYING IDX FROM 1 BY 1 UNTIL IDX > TASK-COUNT
               IF TASKS-ID(IDX) = WS-TASK-ID
                   DISPLAY "Editing Task: " TASKS-TITLE(IDX)
                   DISPLAY "Enter new title (leave blank to keep):"
                   ACCEPT WS-INPUT
                   IF WS-INPUT NOT = SPACES AND FUNCTION LENGTH(WS-INPUT
      -             ) > 0
                       MOVE WS-INPUT TO TASKS-TITLE(IDX)
                   END-IF
                   DISPLAY "Enter new description 
      -                 " (leave blank to keep):"
                   ACCEPT WS-INPUT
                   IF WS-INPUT NOT = SPACES AND FUNCTION LENGTH(WS-INPUT
      -             ) > 0
                       MOVE WS-INPUT TO TASKS-DESCRIPTION(IDX)
                   END-IF
                   DISPLAY "Enter new end date 
      -                 "(YYYYMMDD, leave blank to keep):"
                   ACCEPT WS-INPUT
                   IF WS-INPUT NOT = SPACES AND FUNCTION LENGTH(WS-INPUT
      -             ) > 0
                       MOVE WS-INPUT TO TASKS-END-DATE(IDX)
                   END-IF
                   DISPLAY "Enter new tags (leave blank to keep):"
                   ACCEPT WS-INPUT
                   IF WS-INPUT NOT = SPACES AND FUNCTION LENGTH(WS-INPUT
      -             ) > 0
                       MOVE WS-INPUT TO TASKS-TAGS(IDX)
                   END-IF
                   DISPLAY "Enter new priority (1/2/3, 
      -                 "leave blank to keep):"
                   ACCEPT WS-INPUT
                   IF WS-INPUT NOT = SPACES AND FUNCTION LENGTH(WS-INPUT
      -            ) > 0
                       MOVE FUNCTION NUMVAL(WS-INPUT)
      -                    TO TASKS-PRIORITY(IDX)
                   END-IF
                   PERFORM GET-CURRENT-DATETIME
                   MOVE WS-CURRENT-DATETIME TO TASKS-UPDATE-DT(IDX)
                   DISPLAY "Task updated."
                   MOVE 'Y' TO WS-FOUND
                   EXIT PERFORM
               END-IF
           END-PERFORM
           IF WS-FOUND = 'N'
               DISPLAY "Task not found."
           END-IF
           .

      * --- Utility Procedures ---
       CALCULATE-AGE.
           PERFORM GET-CURRENT-DATE
           PERFORM CALCULATE-AGE-FROM-BIRTHDATE
           .

       CALCULATE-AGE-FROM-BIRTHDATE.
           MOVE FUNCTION NUMVAL(WS-CURRENT-DATE(1:4)) TO WS-CURR-YEAR
           MOVE FUNCTION NUMVAL(WS-CURRENT-DATE(5:2)) TO WS-CURR-MONTH
           MOVE FUNCTION NUMVAL(WS-CURRENT-DATE(7:2)) TO WS-CURR-DAY
           MOVE FUNCTION NUMVAL(USER-BIRTH-DATE(1:4)) TO WS-BIRTH-YEAR
           MOVE FUNCTION NUMVAL(USER-BIRTH-DATE(5:2)) TO WS-BIRTH-MONTH
           MOVE FUNCTION NUMVAL(USER-BIRTH-DATE(7:2)) TO WS-BIRTH-DAY
           COMPUTE WS-AGE = WS-CURR-YEAR - WS-BIRTH-YEAR
           IF WS-CURR-MONTH < WS-BIRTH-MONTH OR
      -        (WS-CURR-MONTH = WS-BIRTH-MONTH AND WS-CURR-DAY < WS-BIRT
      -        H-DAY)
               SUBTRACT 1 FROM WS-AGE
           END-IF
           MOVE WS-AGE TO USER-AGE
           .

       VALIDATE-TASK-END-DATE.
           PERFORM GET-CURRENT-DATE
           IF TASK-END-DATE < WS-CURRENT-DATE
               MOVE 'N' TO WS-DUMMY
           ELSE
               MOVE 'Y' TO WS-DUMMY
           END-IF
           .

       SET-TASK-DATES.
           PERFORM GET-CURRENT-DATETIME
           MOVE WS-CURRENT-DATETIME TO TASK-CREATION-DT
           MOVE WS-CURRENT-DATETIME TO TASK-UPDATE-DT
           .

       GET-CURRENT-DATE.
           MOVE FUNCTION CURRENT-DATE TO WS-FUNCTION-DATE
           MOVE WS-FUNCTION-DATE(1:4) TO WS-CURRENT-DATE(1:4)
           MOVE WS-FUNCTION-DATE(5:2) TO WS-CURRENT-DATE(5:2)
           MOVE WS-FUNCTION-DATE(7:2) TO WS-CURRENT-DATE(7:2)
           .

       GET-CURRENT-DATETIME.
           MOVE FUNCTION CURRENT-DATE TO WS-FUNCTION-DATE
           MOVE WS-FUNCTION-DATE(1:14) TO WS-CURRENT-DATETIME
           .

       END PROGRAM todoapp.
