from nba_api.stats.endpoints import playercareerstats
import json

def handler(event, context):
    try:
        # LeBron James' player ID
        career = playercareerstats.PlayerCareerStats(player_id=2544)
        data = career.get_dict()

        # Get career total points
        regular_season_career = data['resultSets'][1]
        regular_season_points = regular_season_career['rowSet'][0][23]
        postseason_career = data['resultSets'][3]
        postseason_points = postseason_career['rowSet'][0][23]

        response = {
            "player": "LeBron James",
            "career_points": regular_season_points + postseason_points,
        }

        return {
            "statusCode": 200,
            "body": json.dumps(response),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }

if __name__ == "__main__":
    result = handler({}, {})
    print(result)
