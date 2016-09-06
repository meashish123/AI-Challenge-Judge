
import static java.lang.System.out;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

class Main2 {

    public void start() {
        Scanner in = new Scanner(System.in);

        int n = in.nextInt();
        int m = in.nextInt();
        //int[][] grid = {{1, 0, 1}, {0, 2, 0}, {-1, -1, -1}};
        int grid[][] = new int[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                grid[i][j] = in.nextInt();
            }
        }
        int p = in.nextInt();

        Player player = new Player();

        Position pos = player.getMove(grid, p);
        System.out.println(pos.getX() + " " + pos.getY());
    }

    public static void main(String[] args) {
        new Main2().start();
    }

    class Player {

        private ArrayList<Position> getValidPositions(int[][] grid, int playerNo) {
            ArrayList<Position> positions = new ArrayList<>();
            for (int i = 0; i < grid.length; i++) {
                for (int j = 0; j < grid[0].length; j++) {
                    if (grid[i][j] == playerNo) {
                        positions.add(new Position(i, j));
                    }
                }
            }
            return positions;
        }

        private Position move(int[][] grid, Position p) {
            int n = grid.length;
            int m = grid[0].length;

            ArrayList<Position> list = new ArrayList<>();

            if (p.getX() - 1 >= 0 && grid[p.getX() - 1][p.getY()] == 0) {
                list.add(new Position(p.getX() - 1, p.getY()));
            }
            if (p.getY() - 1 >= 0 && grid[p.getX()][p.getY() - 1] == 0) {
                list.add(new Position(p.getX(), p.getY() - 1));
            }
            if (p.getX() + 1 < n && grid[p.getX() + 1][p.getY()] == 0) {
                list.add(new Position(p.getX() + 1, p.getY()));
            }
            if (p.getY() + 1 < m && grid[p.getX()][p.getY() + 1] == 0) {
                list.add(new Position(p.getX(), p.getY() + 1));
            }
            if (p.getX() - 1 >= 0 && p.getY() - 1 >= 0 && grid[p.getX() - 1][p.getY() - 1] == 0) {
                list.add(new Position(p.getX() - 1, p.getY() - 1));
            }
            if (p.getX() + 1 < n && p.getY() + 1 < m && grid[p.getX() + 1][p.getY() + 1] == 0) {
                list.add(new Position(p.getX() + 1, p.getY() + 1));
            }
            if (p.getX() - 1 >= 0 && p.getY() + 1 < m && grid[p.getX() - 1][p.getY() + 1] == 0) {
                list.add(new Position(p.getX() - 1, p.getY() + 1));
            }
            if (p.getX() + 1 < n && p.getY() - 1 >= 0 && grid[p.getX() + 1][p.getY() - 1] == 0) {
                list.add(new Position(p.getX() + 1, p.getY() - 1));
            }
            
            if (list.isEmpty()) {
                return null;
            }

            Collections.shuffle(list);
            return list.get(0);
        }

        public Position getMove(int[][] grid, int playerNo) {
            ArrayList<Position> validPos = getValidPositions(grid, playerNo);
            for (int i = 0; i < validPos.size(); i++) {
                Position pos = move(grid, validPos.get(i));
                if (pos != null) {
                    return pos;
                }
            }
            return new Position(-1, -1);    // indicates cannot move (lost)
        }
    }

    class Position {

        private int xpos;
        private int ypos;

        public Position(int x, int y) {
            this.xpos = x;
            this.ypos = y;
        }

        public void setXPosition(int x) {
            this.xpos = x;
        }

        public void setYPosition(int y) {
            this.ypos = y;
        }

        public int getX() {
            return xpos;
        }

        public int getY() {
            return ypos;
        }
    }
}
