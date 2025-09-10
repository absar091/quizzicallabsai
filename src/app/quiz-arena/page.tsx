// Room hosting/loading screen
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {isCreatingRoom ? (
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-12 h-12 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {isCreatingRoom ? 'Creating Your Room...' : 'Quiz Arena Coming Soon!'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isCreatingRoom
              ? `Setting up "${quizSetup.title}" for ${quizSetup.maxPlayers} players...`
              : 'The multiplayer Quiz Arena feature is under development. Stay tuned for real-time quiz battles!'
            }
          </p>

          {!isCreatingRoom && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">🚀 Features Coming:</h3>
                <ul className="text-left space-y-1 text-muted-foreground">
                  <li>• Real-time multiplayer gameplay</li>
                  <li>• Live leaderboard updates</li>
                  <li>• Private and public rooms</li>
                  <li>• Custom quiz creation</li>
                  <li>• Host controls and moderation</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSetupMode('select')} className="flex-1">
                  Back to Setup
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/">Home</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Code Dialog - Future Implementation */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Created! 🎯</DialogTitle>
            <DialogDescription>
              Your quiz arena is ready. Share this code with friends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold bg-muted p-4 rounded-lg">
                {roomCode}
              </div>
            </div>
            <Button onClick={() => setShowRoomDialog(false)} className="w-full">
              Got it! Start Hosting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
